import { PrismaClient, Prisma } from '@prisma/client';
import { products } from './data';

export async function insertSeedData(ks: any) {

    const prisma = new PrismaClient();

    // Keystone API changed, so we need to check for both versions to get keystone
    const keystone = ks.keystone || ks;

    console.log(`🌱 Inserting Seed Data: ${products.length} Products`);

    for (const product of products) {

        console.log(`  🛍️ Adding Product: ${product.name}`);

        const { id } = await prisma.wb_product_image.create({
            data: {
                image: product.id_product_imageId,
                alt_text: product.description,
            },
        });

        //Для id_product_image - указываем id_product_imageId так как эта foreign key
        //Поэтому дополнительный Id на конце
        product.id_product_imageId = id;

        await prisma.wb_product.create({ data: product });

    }

    console.log(`✅ Seed Data Inserted: ${products.length} Products`);
    console.log(`👋 Please start the process with \`yarn dev\` or \`npm run dev\``);
    process.exit();
 
}