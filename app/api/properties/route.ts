import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getSession();

    const city = searchParams.get('city');
    const locality = searchParams.get('locality');
    const propertyType = searchParams.get('type');
    const listingType = searchParams.get('listingType');
    const commercialOnly = searchParams.get('commercialOnly') === 'true';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const furnished = searchParams.get('furnished');
    const verified = searchParams.get('verified') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search') || searchParams.get('q');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const skip = (page - 1) * limit;

    // Filter conditions
    const where: any = {
      status: 'APPROVED',
    };

    if (city) {
      where.city = { contains: city };
    }

    if (locality) {
      where.locality = { contains: locality };
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (commercialOnly) {
      where.propertyType = { in: ['Office', 'Shop', 'Showroom', 'Warehouse', 'Commercial Building', 'Industrial Property'] };
    }

    if (listingType) {
      where.listingType = listingType;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (bedrooms) {
      const b = parseInt(bedrooms, 10);
      where.bedrooms = b >= 5 ? { gte: 5 } : b;
    }

    if (bathrooms) {
      const b = parseInt(bathrooms, 10);
      where.bathrooms = b >= 4 ? { gte: 4 } : b;
    }

    if (furnished) {
      where.furnishedStatus = furnished;
    }

    if (verified) {
      where.verificationStatus = { in: ['VERIFIED', 'RERA_APPROVED'] };
    }

    if (featured) {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { locality: { contains: search } },
        { city: { contains: search } },
        { address: { contains: search } },
        { reraNumber: { contains: search } },
      ];
    }

    // Sort order
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'views_desc') orderBy = { views: 'desc' };
    if (sortBy === 'oldest') orderBy = { createdAt: 'asc' };

    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          agent: true,
          owner: {
            select: { id: true, name: true, email: true, phone: true },
          },
          amenities: {
            include: { amenity: true },
          },
          favorites: session?.id
            ? {
                where: { userId: session.id },
                select: { id: true },
              }
            : false,
        },
      }),
      prisma.property.count({ where }),
    ]);

    const formattedProperties = properties.map((p) => ({
      ...p,
      isFavorited: Array.isArray(p.favorites) && p.favorites.length > 0,
      favorites: undefined,
    }));

    return NextResponse.json({
      properties: formattedProperties,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('Properties fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please login to post property.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      propertyType,
      listingType,
      price,
      area,
      areaUnit = 'Sq.Ft.',
      bedrooms = 0,
      bathrooms = 0,
      balconies = 0,
      floor = 0,
      totalFloors = 0,
      furnishedStatus = 'Semi-Furnished',
      parking = '1 Covered',
      facing = 'North-East',
      address,
      locality,
      city,
      state = 'Uttar Pradesh',
      pincode,
      images = [],
      amenities = [],
      reraNumber,
    } = body;

    if (!title || !propertyType || !price || !area || !locality || !city || !pincode) {
      return NextResponse.json(
        { error: 'Please provide all required property details (Title, Type, Price, Area, Location, Pincode).' },
        { status: 400 }
      );
    }

    const priceNum = parseFloat(price);
    const areaNum = parseFloat(area);
    const pricePerSqFt = areaNum > 0 ? Math.round(priceNum / areaNum) : 0;

    let baseSlug = slugify(title);
    let uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Set initial status: ADMIN posts are immediately APPROVED; Users/Agents submit as PENDING_APPROVAL
    const initialStatus = session.role === 'ADMIN' ? 'APPROVED' : 'PENDING_APPROVAL';

    const property = await prisma.property.create({
      data: {
        title,
        slug: uniqueSlug,
        description: description || `Premium ${bedrooms ? bedrooms + ' BHK' : ''} ${propertyType} in ${locality}, ${city}.`,
        propertyType,
        listingType: listingType || 'FOR_SALE',
        price: priceNum,
        pricePerSqFt,
        area: areaNum,
        areaUnit,
        bedrooms: parseInt(bedrooms, 10) || 0,
        bathrooms: parseInt(bathrooms, 10) || 0,
        balconies: parseInt(balconies, 10) || 0,
        floor: parseInt(floor, 10) || 0,
        totalFloors: parseInt(totalFloors, 10) || 0,
        furnishedStatus,
        parking,
        facing,
        address: address || locality,
        locality,
        city,
        state,
        pincode,
        latitude: 28.5355,
        longitude: 77.3910,
        ownerId: session.id,
        status: initialStatus,
        verificationStatus: reraNumber ? 'RERA_APPROVED' : 'VERIFIED',
        reraNumber: reraNumber || null,
        featured: false,
        images: {
          create: (images.length > 0 ? images : [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
          ]).map((url: string, index: number) => ({
            url,
            isFeatured: index === 0,
            order: index,
          })),
        },
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: session.id,
        title: initialStatus === 'APPROVED' ? 'Property Published!' : 'Property Submitted for Review',
        message: initialStatus === 'APPROVED' 
          ? `Your property "${title}" is now live on RAS Properties.`
          : `Your property "${title}" is under admin review and will be approved within 2-4 hours.`,
        type: 'PROPERTY_APPROVED',
        link: `/dashboard/my-properties`,
      },
    });

    return NextResponse.json(
      {
        message: initialStatus === 'APPROVED' ? 'Property published successfully!' : 'Property submitted for admin approval!',
        property,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Post property error:', error);
    return NextResponse.json({ error: 'Failed to post property. Please check fields.' }, { status: 500 });
  }
}
