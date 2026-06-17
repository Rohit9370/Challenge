require("dotenv").config();
const { sequelize, User, Store, Rating } = require("./models");

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("✅ Database synced");

    // Create Stores
    const store1 = await Store.create({
      name: "Awesome Electronics Store Plus",
      email: "electronics@store.com",
      address: "123 Main Street, Downtown City Center, State 12345",
    });

    const store2 = await Store.create({
      name: "Fashion Boutique Premium Shop",
      email: "fashion@boutique.com",
      address: "456 Fashion Avenue, Shopping District, State 67890",
    });

    const store3 = await Store.create({
      name: "Organic Grocery Market Place",
      email: "grocery@organic.com",
      address: "789 Green Street, Eco-Friendly Zone, State 11223",
    });

    const store4 = await Store.create({
      name: "Tech Gadgets Premium Store",
      email: "tech@gadgets.com",
      address: "321 Innovation Drive, Tech Hub, State 44556",
    });

    const store5 = await Store.create({
      name: "Home Furniture Collection Shop",
      email: "furniture@home.com",
      address: "654 Interior Boulevard, Design District, State 77889",
    });

    console.log("✅ Stores created");

    // Create Admin Users
    const admin1 = await User.create({
      name: "System Administrator Main",
      email: "admin@system.com",
      password: "Admin@123",
      address: "Admin Office, Corporate Building, Suite 100, State 00000",
      role: "admin",
    });

    const admin2 = await User.create({
      name: "Super Administrator User",
      email: "superadmin@system.com",
      password: "SuperAdmin@123",
      address: "Executive Office, Headquarters Building, Floor 10, State 00001",
      role: "admin",
    });

    const admin3 = await User.create({
      name: "Administrator Manager Account",
      email: "admin.manager@system.com",
      password: "AdminManager@123",
      address: "Management Office, Corporate Tower, Level 5, State 00002",
      role: "admin",
    });

    console.log("✅ Admins created");

    // Create Store Owners
    const owner1 = await User.create({
      name: "Electronics Store Owner Manager",
      email: "owner.electronics@store.com",
      password: "Owner@123",
      address: "123 Main Street, Downtown City Center, State 12345",
      role: "owner",
      storeId: store1.id,
    });

    const owner2 = await User.create({
      name: "Fashion Boutique Owner Manager",
      email: "owner.fashion@store.com",
      password: "FashionOwner@123",
      address: "456 Fashion Avenue, Shopping District, State 67890",
      role: "owner",
      storeId: store2.id,
    });

    const owner3 = await User.create({
      name: "Grocery Store Owner Manager",
      email: "owner.grocery@store.com",
      password: "GroceryOwner@123",
      address: "789 Green Street, Eco-Friendly Zone, State 11223",
      role: "owner",
      storeId: store3.id,
    });

    const owner4 = await User.create({
      name: "Tech Gadgets Store Owner Manager",
      email: "owner.tech@store.com",
      password: "TechOwner@123",
      address: "321 Innovation Drive, Tech Hub, State 44556",
      role: "owner",
      storeId: store4.id,
    });

    console.log("✅ Owners created");

    // Create Normal Users
    const user1 = await User.create({
      name: "Regular Customer John Smith",
      email: "user1@email.com",
      password: "User@123",
      address: "101 Residential Street, Suburb Area, State 99999",
      role: "user",
    });

    const user2 = await User.create({
      name: "Regular Customer Jane Doe Anderson",
      email: "user2@email.com",
      password: "User2@123",
      address: "202 Park Avenue, City Heights, State 88888",
      role: "user",
    });

    const user3 = await User.create({
      name: "Regular Customer Bob Johnson Williams",
      email: "user3@email.com",
      password: "User3@123",
      address: "303 Lake View Drive, Waterfront, State 77777",
      role: "user",
    });

    const user4 = await User.create({
      name: "Regular Customer Alice Brown Martinez",
      email: "user4@email.com",
      password: "User4@123",
      address: "404 Mountain Road, Highland Area, State 66666",
      role: "user",
    });

    const user5 = await User.create({
      name: "Regular Customer Charlie Davis Thompson",
      email: "user5@email.com",
      password: "User5@123",
      address: "505 Valley Street, Lowland District, State 55555",
      role: "user",
    });

    console.log("✅ Users created");

    // Create Ratings
    await Rating.create({ userId: user1.id, storeId: store1.id, rating: 5 });
    await Rating.create({ userId: user1.id, storeId: store2.id, rating: 4 });
    await Rating.create({ userId: user1.id, storeId: store3.id, rating: 3 });
    
    await Rating.create({ userId: user2.id, storeId: store1.id, rating: 4 });
    await Rating.create({ userId: user2.id, storeId: store3.id, rating: 5 });
    await Rating.create({ userId: user2.id, storeId: store4.id, rating: 4 });
    
    await Rating.create({ userId: user3.id, storeId: store2.id, rating: 3 });
    await Rating.create({ userId: user3.id, storeId: store3.id, rating: 5 });
    await Rating.create({ userId: user3.id, storeId: store5.id, rating: 4 });
    
    await Rating.create({ userId: user4.id, storeId: store1.id, rating: 5 });
    await Rating.create({ userId: user4.id, storeId: store4.id, rating: 5 });
    await Rating.create({ userId: user4.id, storeId: store5.id, rating: 3 });
    
    await Rating.create({ userId: user5.id, storeId: store2.id, rating: 4 });
    await Rating.create({ userId: user5.id, storeId: store4.id, rating: 5 });
    await Rating.create({ userId: user5.id, storeId: store5.id, rating: 5 });

    console.log("✅ Ratings created");

    console.log("\n" + "=".repeat(80));
    console.log("📋 TEST CREDENTIALS - SAVE THESE FOR TESTING");
    console.log("=".repeat(80));
    
    console.log("\n🔑 ADMIN ACCOUNTS (Full System Access):");
    console.log("─".repeat(80));
    console.log("1. Main Admin");
    console.log("   Email:    admin@system.com");
    console.log("   Password: Admin@123");
    console.log("\n2. Super Admin");
    console.log("   Email:    superadmin@system.com");
    console.log("   Password: SuperAdmin@123");
    console.log("\n3. Admin Manager");
    console.log("   Email:    admin.manager@system.com");
    console.log("   Password: AdminManager@123");

    console.log("\n🏪 STORE OWNER ACCOUNTS (View Store Ratings):");
    console.log("─".repeat(80));
    console.log("1. Electronics Store Owner");
    console.log("   Email:    owner.electronics@store.com");
    console.log("   Password: Owner@123");
    console.log("\n2. Fashion Store Owner");
    console.log("   Email:    owner.fashion@store.com");
    console.log("   Password: FashionOwner@123");
    console.log("\n3. Grocery Store Owner");
    console.log("   Email:    owner.grocery@store.com");
    console.log("   Password: GroceryOwner@123");
    console.log("\n4. Tech Gadgets Store Owner");
    console.log("   Email:    owner.tech@store.com");
    console.log("   Password: TechOwner@123");

    console.log("\n👤 REGULAR USER ACCOUNTS (Browse & Rate Stores):");
    console.log("─".repeat(80));
    console.log("1. User 1 - John");
    console.log("   Email:    user1@email.com");
    console.log("   Password: User@123");
    console.log("\n2. User 2 - Jane");
    console.log("   Email:    user2@email.com");
    console.log("   Password: User2@123");
    console.log("\n3. User 3 - Bob");
    console.log("   Email:    user3@email.com");
    console.log("   Password: User3@123");
    console.log("\n4. User 4 - Alice");
    console.log("   Email:    user4@email.com");
    console.log("   Password: User4@123");
    console.log("\n5. User 5 - Charlie");
    console.log("   Email:    user5@email.com");
    console.log("   Password: User5@123");

    console.log("\n" + "=".repeat(80));
    console.log("✅ Database seeding completed successfully!");
    console.log("=".repeat(80) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
