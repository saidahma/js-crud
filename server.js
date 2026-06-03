const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ============ SEQUELIZE ORM ULANISHI ============
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './usercrm.db',
    logging: false // Konsolda SQL so'rovlar matni chiqmasligi uchun
});

// ============ MODELLARNI ANQLASH (ORM TABLES) ============
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER },
    email: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'users', timestamps: false });

const Address = sequelize.define('Address', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    city_address: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'addresses', timestamps: false });

// Jadvallar o'rtasidagi munosabat (Relational Mapping)
User.hasOne(Address, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'user_id' });

// ============ BAZANI SINXRONLASH VA MIGRATSIYA ============
async function initDatabase() {
    try {
        await sequelize.sync(); // Jadvallarni avtomatik yaratadi (CREATE TABLE IF NOT EXISTS)
        console.log('✅ Sequelize orqali SQLite-ga muvaffaqiyatli ulandi');

        const count = await User.count();
        if (count === 0) {
            console.log('⏳ 90 ta foydalanuvchi bazaga kiritilmoqda...');
            // Ma'lumotlarni ommaviy yuklash (Bulk Insert)
            for (let i = 0; i < initialUsersArray.length; i++) {
                const user = initialUsersArray[i];
                const createdUser = await User.create({ name: user.name, age: user.age, email: user.email });
                if (user.address && user.address.trim() !== "") {
                    await Address.create({ user_id: createdUser.id, city_address: user.address });
                }
            }
            console.log('✅ 90 ta foydalanuvchi muvaffaqiyatli yuklandi!');
        }
    } catch (err) {
        console.error('❌ Database xatosi:', err.message);
    }
}
initDatabase();

// 90 ta foydalanuvchi massivi
const initialUsersArray = [
  // === O'ZBEKISTON ===
  { name: "Ali Karimov", age: 25, email: "ali.karimov@example.com", address: "Toshkent sh., Yunusobod t." },
  { name: "Vali Rahimov", age: 30, email: "vali.rahimov@example.com", address: "Samarqand vil., Pastdarg'om t." },
  { name: "Hasan Sodiqov", age: 28, email: "hasan.sodiqov@example.com", address: "Buxoro sh., Navoiy ko'chasi" },
  { name: "Sardorbek Aliyev", age: 22, email: "sardor81@example.com" },
  { name: "Madina Axmedova", age: 26, email: "madina82@example.com" },
  { name: "Lola Umarova", age: 24, email: "lola83@example.com", address: "Farg'ona sh., Mustaqillik ko'chasi" },
  { name: "Dostonbek Tojirov", age: 29, email: "doston84@example.com", address: "Andijon vil., Asaka t." },
  { name: "Nigora Sultanova", age: 23, email: "nigora85@example.com" },
  { name: "Shaxzoda To'rayeva", age: 21, email: "shaxzoda86@example.com", address: "Namangan sh., Do'stlik ko'chasi" },
  { name: "Xurshid Rustamov", age: 28, email: "xurshid87@example.com", address: "Jizzax sh., Sharaf Rashidov ko'chasi" },
  { name: "Jasurbek Olimov", age: 30, email: "jasur88@example.com", address: "Qashqadaryo vil., Qarshi sh." },
  { name: "Shahlo Qodirova", age: 25, email: "shahlo89@example.com" },
  { name: "Olimjon Abduvaliyev", age: 32, email: "olim90@example.com", address: "Xorazm vil., Urganch sh." },
  { name: "Bekzod Shukurov", age: 27, email: "bekzod@example.com", address: "Navoiy vil., Zarafshon sh." },
  { name: "Zuhra Ergasheva", age: 26, email: "zuhra@example.com", address: "Sirdaryo vil., Guliston sh." },
  // === ROSSIYA ===
  { name: "Aleksandr Ivanov", age: 25, email: "alex.ivanov@mail.ru", address: "g. Moskva, ul. Tverskaya, d. 12" },
  { name: "Dmitriy Petrov", age: 30, email: "dima.petrov@yandex.ru", address: "g. Sankt-Peterburg, Nevskiy pr., d. 45" },
  { name: "Elena Smirnova", age: 28, email: "elena.sm@mail.ru", address: "g. Novosibirsk, ul. Lenina, d. 8" },
  { name: "Artyom Kuznesov", age: 22, email: "artyom.kuz@yandex.ru" },
  { name: "Olga Popova", age: 26, email: "olga.popova@mail.ru" },
  { name: "Sergey Vasilyev", age: 24, email: "sergey.v@yandex.ru", address: "g. Yekaterinburg, ul. Malysheva, d. 21" },
  { name: "Mariya Sokolova", age: 29, email: "masha.sok@mail.ru", address: "g. Kazan, ul. Baumana, d. 14" },
  { name: "Nikolay Volkov", age: 23, email: "nikolay.v@yandex.ru" },
  { name: "Anna Morozova", age: 21, email: "anna.moroz@mail.ru", address: "g. Nijniy Novgorod, ul. Gorkogo, d. 5" },
  { name: "Vladimir Fedorov", age: 28, email: "vlad.fed@yandex.ru", address: "g. Chelyabinsk, pr. Lenina, d. 67" },
  { name: "Tatyana Kozlova", age: 30, email: "tanya.koz@mail.ru", address: "g. Samara, ul. Sadovaya, d. 89" },
  { name: "Mikhail Lebedev", age: 25, email: "misha.leb@yandex.ru" },
  { name: "Natalya Egorova", age: 32, email: "natasha.eg@mail.ru", address: "g. Rostov-na-Donu, ul. Pushkinskaya, d. 34" },
  { name: "Igor Kozlov", age: 27, email: "igor.k@yandex.ru", address: "g. Ufa, ul. Lenina, d. 102" },
  { name: "Svetlana Novikova", age: 26, email: "svetlana.nov@mail.ru", address: "g. Krasnoyarsk, ul. Mira, d. 15" },
  // === AMERIKA ===
  { name: "John Smith", age: 25, email: "john.smith@gmail.com", address: "New York, 5th Avenue, Apt 4B" },
  { name: "Michael Johnson", age: 30, email: "michael.j@yahoo.com", address: "Los Angeles, Sunset Blvd, House 890" },
  { name: "Emily Williams", age: 28, email: "emily.w@gmail.com", address: "Chicago, Michigan Avenue, Suite 12" },
  { name: "David Brown", age: 22, email: "david.brown@hotmail.com" },
  { name: "Sarah Jones", age: 26, email: "sarah.jones@gmail.com" },
  { name: "James Miller", age: 24, email: "james.m@yahoo.com", address: "Houston, Texas Ave, Bldg 4" },
  { name: "Jessica Davis", age: 29, email: "jessica.d@gmail.com", address: "Phoenix, Camelback Rd, Apt 18" },
  { name: "Robert Garcia", age: 23, email: "robert.g@hotmail.com" },
  { name: "Jennifer Rodriguez", age: 21, email: "jennifer.r@gmail.com", address: "Philadelphia, Broad St, House 55" },
  { name: "William Wilson", age: 28, email: "william.w@yahoo.com", address: "San Antonio, Alamo Plaza, Apt 9" },
  { name: "Linda Martinez", age: 30, email: "linda.m@gmail.com", address: "San Diego, Broadway St, House 71" },
  { name: "Thomas Anderson", age: 25, email: "thomas.a@hotmail.com" },
  { name: "Barbara Taylor", age: 32, email: "barbara.t@gmail.com", address: "Dallas, Main St, Suite 400" },
  { name: "Christopher Thomas", age: 27, email: "chris.t@yahoo.com", address: "San Jose, First St, House 23" },
  { name: "Susan Moore", age: 26, email: "susan.m@gmail.com", address: "Austin, Congress Ave, Apt 302" },
  // === TURKIYA ===
  { name: "Ahmet Yılmaz", age: 25, email: "ahmet.yilmaz@gmail.com", address: "İstanbul, Kadıköy, Moda Cd. No:12" },
  { name: "Mehmet Demir", age: 30, email: "mehmet.demir@hotmail.com", address: "Ankara, Çankaya, Tunalı Hilmi Cd. 45" },
  { name: "Mustafa Çelik", age: 28, email: "mustafa.celik@gmail.com", address: "İzmir, Konak, Mithatpaşa Cd. No:88" },
  { name: "Aysun Kaya", age: 22, email: "aysun.kaya@yahoo.com" },
  { name: "Fatma Şahin", age: 26, email: "fatma.sahin@gmail.com" },
  { name: "Ali Öztürk", age: 24, email: "ali.ozturk@hotmail.com", address: "Bursa, Osmangazi, Altıparmak Cd. 21" },
  { name: "Ayşe Aydın", age: 29, email: "ayse.aydin@gmail.com", address: "Antalya, Muratpaşa, Isıklar Cd. 14" },
  { name: "Hüseyin Özdemir", age: 23, email: "huseyin.oz@yahoo.com" },
  { name: "Emine Arslan", age: 21, email: "emine.arslan@gmail.com", address: "Adana, Seyhan, Ziyapaşa Bulvarı 5" },
  { name: "Murat Doğan", age: 28, email: "murat.dogan@hotmail.com", address: "Gaziantep, Şahinbey, Karagöz Cd. 67" },
  { name: "Hatice Kılıç", age: 30, email: "hatice.kilic@gmail.com", address: "Konya, Selçuklu, Nalçacı Cd. 89" },
  { name: "İbrahim Yıldız", age: 25, email: "ibrahim.y@yahoo.com" },
  { name: "Zeynep Aslan", age: 32, email: "zeynep.aslan@gmail.com", address: "Mersin, Yenişehir, Adnan Menderes Blv." },
  { name: "Can Erdoğan", age: 27, email: "can.erdogan@hotmail.com", address: "Diyarbakır, Sur, Gazi Cd. No:10" },
  { name: "Elif Bulut", age: 26, email: "elif.bulut@gmail.com", address: "Samsun, Atakum, Atatürk Blv. 15" },
  // === MEKSIKA ===
  { name: "Juan Hernández", age: 25, email: "juan.hernandez@gmail.com", address: "CDMX, Av. Insurgentes Sur 120" },
  { name: "Miguel García", age: 30, email: "miguel.garcia@yahoo.com", address: "Guadalajara, Av. Juárez 450" },
  { name: "María Martínez", age: 28, email: "maria.martinez@gmail.com", address: "Monterrey, Av. Constitución 8" },
  { name: "José López", age: 22, email: "jose.lopez@hotmail.com" },
  { name: "Guadalupe González", age: 26, email: "lupe.gonzalez@gmail.com" },
  { name: "Francisco Pérez", age: 24, email: "francisco.p@yahoo.com", address: "Puebla, Calle 5 Poniente 21" },
  { name: "Ana Rodríguez", age: 29, email: "ana.rodriguez@gmail.com", address: "Tijuana, Av. Revolución 14" },
  { name: "Pedro Sánchez", age: 23, email: "pedro.sanchez@hotmail.com" },
  { name: "Luisa Ramírez", age: 21, email: "luisa.ramirez@gmail.com", address: "León, Blvd. Adolfo López Mateos 5" },
  { name: "Carlos Flores", age: 28, email: "carlos.flores@yahoo.com", address: "Juárez, Av. Tecnológico 67" },
  { name: "Martha Gómez", age: 30, email: "martha.gomez@gmail.com", address: "Merida, Calle 60 No. 89" },
  { name: "Jorge Díaz", age: 25, email: "jorge.diaz@hotmail.com" },
  { name: "Sofia Cruz", age: 32, email: "sofia.cruz@gmail.com", address: "San Luis Potosí, Av. Carranza 34" },
  { name: "Raúl Reyes", age: 27, email: "raul.reyes@yahoo.com", address: "Querétaro, Av. 5 de Febrero 10" },
  { name: "Elena Morales", age: 26, email: "elena.morales@gmail.com", address: "Cancún, Av. Tulum Mz 15" },
  // === BRAZILIYA ===
  { name: "Gabriel Silva", age: 25, email: "gabriel.silva@uol.com.br", address: "São Paulo, Av. Paulista, 1200" },
  { name: "Lucas Santos", age: 30, email: "lucas.santos@gmail.com", address: "Rio de Janeiro, Av. Atlântica, 450" },
  { name: "Julia Oliveira", age: 28, email: "julia.olliveira@hotmail.com", address: "Salvador, Av. Sete de Setembro, 8" },
  { name: "Pedro Souza", age: 22, email: "pedro.souza@yahoo.com.br" },
  { name: "Mariana Rodrigues", age: 26, email: "mariana.rod@gmail.com" },
  { name: "Matheus Ferreira", age: 24, email: "matheus.f@hotmail.com", address: "Brasília, Eixo Monumental, Bloco C" },
  { name: "Beatriz Almeida", age: 29, email: "beatriz.almeida@gmail.com", address: "Fortaleza, Av. Beira Mar, 14" },
  { name: "Thiago Ribeiro", age: 23, email: "thiago.rib@uol.com.br" },
  { name: "Ana Costa", age: 21, email: "ana.costa@gmail.com", address: "Belo Horizonte, Av. Afonso Pena, 55" },
  { name: "Luiz Carvalho", age: 28, email: "luiz.carv@hotmail.com", address: "Manaus, Av. Eduardo Ribeiro, 67" },
  { name: "Larissa Gomes", age: 30, email: "larissa.gomes@gmail.com", address: "Curitiba, Rua XV de Novembro, 89" },
  { name: "Bruno Martins", age: 25, email: "bruno.mar@yahoo.com.br" },
  { name: "Camila Rocha", age: 32, email: "camila.rocha@gmail.com", address: "Porto Alegre, Av. Borges de Medeiros" },
  { name: "Felipe Lima", age: 27, email: "felipe.lima@hotmail.com", address: "Recife, Av. Boa Viagem, 102" },
  { name: "Amanda Dias", age: 26, email: "amanda.dias@gmail.com", address: "Belém, Av. Nazaré, 15" }
];

// ============ REUSABLE UI COMPONENTS ============
const getNavigationMenu = () => `
    <div class="btn-container">
        <a href="/ui/sql-users" class="btn btn-main">🏠 Bosh Jadval (All Info)</a>
        <a href="/ui/sql-users?view=addresses-only" class="btn btn-addr">📍 Addresses Only</a>
        <a href="/ui/sql-users?view=no-address" class="btn btn-no-addr">❌ No Address Users</a>
        <a href="/ui/sql-users?view=age-group" class="btn btn-group">👥 Same Aged Customers (8+)</a>
    </div>
`;

const commonStyles = `
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
        h2, h3 { text-align: center; color: #333; }
        .btn-container { text-align: center; margin-bottom: 20px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
        .btn { padding: 8px 15px; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px; display: inline-block; border: none; cursor: pointer; }
        .btn:hover { opacity: 0.9; }
        .btn-main { background: #222; }
        .btn-addr { background: #2E7D32; }
        .btn-no-addr { background: #FF9800; }
        .btn-group { background: #E53935; }
        
        .btn-add { background: #4CAF50; padding: 10px 20px; font-size: 16px; }
        .btn-edit { background: #2196F3; font-size: 12px; padding: 5px 15px; }
        .btn-delete { background: #f44336; font-size: 12px; padding: 5px 15px; }
        .action-cell { display: flex; gap: 8px; }

        table { width: 95%; margin: 20px auto; border-collapse: collapse; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        tr:nth-child(even) { background: #f9f9f9; }
        .id-badge { background: #eee; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #555; }
        
        .form-container { width: 95%; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); box-sizing: border-box;}
        .form-grid { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end; }
        .form-group { flex: 1; min-width: 150px; display: flex; flex-direction: column; }
        .form-group label { font-size: 13px; font-weight: bold; margin-bottom: 5px; color: #555; }
        .form-group input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
    </style>
`;

// ============ API ENDPOINTS (ORM BILAN) ============

// 1. ADD USER (Foydalanuvchi va manzil qo'shish)
app.post('/api/users/add', async (req, res) => {
    const { name, age, email, address } = req.body;
    try {
        const newUser = await User.create({ name, age, email });
        if (address && address.trim() !== "") {
            await Address.create({ user_id: newUser.id, city_address: address });
        }
        res.redirect('/ui/sql-users');
    } catch (err) {
        res.send("Xato: " + err.message);
    }
});

// 2. DELETE USER (O'chirish - Cascade borligi uchun manzil ham o'chadi)
app.post('/api/users/delete/:id', async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.redirect('/ui/sql-users');
    } catch (err) {
        res.send("Xato: " + err.message);
    }
});

// 3. CHANGE USER (Tahrirlash)
app.post('/api/users/change/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, age, email, address } = req.body;
    try {
        await User.update({ name, age, email }, { where: { id: userId } });
        
        const existingAddress = await Address.findOne({ where: { user_id: userId } });
        if (existingAddress) {
            if (address && address.trim() !== "") {
                await Address.update({ city_address: address }, { where: { user_id: userId } });
            } else {
                await Address.destroy({ where: { user_id: userId } });
            }
        } else if (address && address.trim() !== "") {
            await Address.create({ user_id: userId, city_address: address });
        }
        res.redirect('/ui/sql-users');
    } catch (err) {
        res.send("Xato: " + err.message);
    }
});

// ============ UI ROUTE ============
app.get('/ui/sql-users', async (req, res) => {
    const view = req.query.view; 

    try {
        // 1-KO'RINISH: Faqat manzillar
        if (view === 'addresses-only') {
            const rows = await Address.findAll({ order: [['user_id', 'ASC']] });
            let html = `<html><head><title>Addresses Only</title>${commonStyles}</head><body>
            <h2>📍 Faqat Manzillar jadvali (Addresses Table)</h2>
            ${getNavigationMenu()}
            <table>
                <tr><th style="background:#2E7D32; color:white; width:15%;">Address ID</th><th style="background:#2E7D32; color:white; width:25%;">Mijoz ID (user_id)</th><th style="background:#2E7D32; color:white; width:60%;">Yashash Manzili</th></tr>`;
            rows.forEach(row => {
                html += `<tr><td><span class="id-badge">#${row.id}</span></td><td>USER_ID: <strong>${row.user_id}</strong></td><td>🏢 ${row.city_address}</td></tr>`;
            });
            html += `</table></body></html>`;
            return res.send(html);
        }

        // 2-KO'RINISH: Manzili yo'qlar
        if (view === 'no-address') {
            const rows = await User.findAll({
                include: [{ model: Address, required: false }],
                where: sequelize.literal('`Address`.`city_address` IS NULL'),
                order: [['id', 'ASC']]
            });
            let html = `<html><head><title>No Address Users</title>${commonStyles}</head><body>
            <h2>❌ Yashash manzili kiritilmagan foydalanuvchilar</h2>
            ${getNavigationMenu()}
            <table>
                <tr><th style="background:#FF9800; color:white; width:10%;">User ID</th><th style="background:#FF9800; color:white;">Ism-Familiya</th><th style="background:#FF9800; color:white; width:15%;">Yosh</th><th style="background:#FF9800; color:white;">Email</th><th style="background:#FF9800; color:white;">Holat</th></tr>`;
            rows.forEach(user => {
                html += `<tr><td><span class="id-badge">#${user.id}</span></td><td><strong>${user.name}</strong></td><td>${user.age} yosh</td><td>📧 ${user.email}</td><td style="color:#D32F2F; font-weight:bold;">⚠️ Manzil yo'q</td></tr>`;
            });
            html += `</table></body></html>`;
            return res.send(html);
        }

        // 3-KO'RINISH: Yosh bo'yicha guruhlanganlar
        if (view === 'age-group') {
            const rows = await User.findAll({
                attributes: [
                    'age',
                    [sequelize.fn('COUNT', sequelize.col('User.id')), 'total_customers'],
                    [sequelize.literal("GROUP_CONCAT(User.name || ' (' || COALESCE(`Address`.`city_address`, 'Manzil kiritilmagan') || ')', '||')"), 'people_and_addresses']
                ],
                include: [{ model: Address, attributes: [], required: false }],
                group: ['age'],
                having: sequelize.literal('total_customers >= 8'),
                order: [['age', 'ASC']],
                raw: true
            });

            let html = `<html><head><title>Same Aged</title>${commonStyles}<style>.main-table th { background: #D32F2F; color: white; text-align: center; } .address-table { width: 100%; border-collapse: collapse; background: #fafafa; } .address-table th { background: #555; color: white; padding: 6px; font-size: 13px; } .address-table td { border: 1px solid #ddd; padding: 8px; font-size: 14px; } .badge { background: #E53935; color: white; padding: 6px 12px; border-radius: 12px; font-size: 14px; font-weight: bold; display: block; text-align: center; }</style></head><body>
            <h2>📊 Relational Tables (Yosh bo'yicha guruhlangan)</h2>
            ${getNavigationMenu()}
            <table class="main-table">
                <tr><th>Yosh (Age)</th><th>Mijozlar Soni</th><th>Mijozlar va Manzillar</th></tr>`;
            if (rows.length === 0) {
                html += `<tr><td colspan="3" style="text-align:center; color:#999; padding:20px;">Bazada 8 tadan ko'p bo'lgan guruh topilmadi.</td></tr>`;
            } else {
                rows.forEach(group => {
                    const peopleList = group.people_and_addresses.split('||');
                    let addressTableHtml = `<table class="address-table"><tr><th>Mijoz ismi</th><th>Yashash manzili</th></tr>`;
                    peopleList.forEach(person => {
                        const parts = person.split(' (');
                        const name = parts[0];
                        const address = parts[1] ? parts[1].replace(')', '') : "Kiritilmagan";
                        addressTableHtml += `<tr><td>👤 <strong>${name}</strong></td><td>📍 ${address}</td></tr>`;
                    });
                    addressTableHtml += `</table>`;
                    html += `<tr><td style="text-align:center; vertical-align: middle;"><strong>${group.age} yosh</strong></td><td style="vertical-align: middle;"><span class="badge">${group.total_customers} ta mijoz</span></td><td>${addressTableHtml}</td></tr>`;
                });
            }
            html += `</table></body></html>`;
            return res.send(html);
        }

        // 4-KO'RINISH: DEFAULT - Bosh sahifa (Hamma foydalanuvchilar va CRUD)
        const rows = await User.findAll({
            include: [{ model: Address, required: false }],
            order: [['id', 'ASC']]
        });

        let html = `<html><head><title>CRM Control Panel</title>${commonStyles}</head><body>
        <h2>📊 Relational CRM - Boshqaruv paneli (Sequelize ORM)</h2>
        ${getNavigationMenu()}
        
        <div class="form-container">
            <h3>➕ Yangi mijoz qo'shish</h3>
            <form action="/api/users/add" method="POST" class="form-grid">
                <div class="form-group"><label>Ism-Familiya</label><input type="text" name="name" required placeholder="Elbek"></div>
                <div class="form-group"><label>Yosh</label><input type="number" name="age" required placeholder="24"></div>
                <div class="form-group"><label>Email</label><input type="email" name="email" required placeholder="elbek@example.com"></div>
                <div class="form-group"><label>Manzil (Ixtiyoriy)</label><input type="text" name="address" placeholder="Toshkent sh."></div>
                <button type="submit" class="btn btn-add">Qo'shish</button>
            </form>
        </div>

        <table>
            <tr><th>ID</th><th>Name & Surname</th><th>Age</th><th>Email</th><th>Address</th><th>Amallar (Actions)</th></tr>`;
        rows.forEach(user => {
            const currentAddress = user.Address ? user.Address.city_address : "";
            html += `<tr>
                <td><span class="id-badge">#${user.id}</span></td>
                <form method="POST">
                    <td><input type="text" name="name" value="${user.name}" style="width:140px;"></td>
                    <td><input type="number" name="age" value="${user.age}" style="width:55px;"></td>
                    <td><input type="email" name="email" value="${user.email}" style="width:180px;"></td>
                    <td><input type="text" name="address" value="${currentAddress}" placeholder="Manzil yo'q" style="width:200px;"></td>
                    <td class="action-cell">
                        <button type="submit" formaction="/api/users/change/${user.id}" class="btn btn-edit">Change</button>
                        <button type="submit" formaction="/api/users/delete/${user.id}" class="btn btn-delete" onclick="return confirm('Mijoz o\\'chirilsinmi?')">Delete</button>
                    </td>
                </form>
            </tr>`;
        });
        html += `</table></body></html>`;
        res.send(html);

    } catch (err) {
        res.send("DB Error: " + err.message);
    }
});

// ============ SERVER ============
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server http://localhost:${PORT} da ishga tushdi`));