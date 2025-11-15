export const cars = [
  // Budget Cars (Under $30k)
  {
    id: 1,
    year: 2024,
    make: "Toyota",
    model: "Corolla",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop&q=80",
    price: 25000
  },
  {
    id: 2,
    year: 2023,
    make: "Honda",
    model: "Civic",
    condition: "Used",
    mileage: 15000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2022-honda-civic-hatchback-sport-touring-309-1634066512.jpg?crop=0.617xw:0.520xh;0.298xw,0.477xh&resize=2048:*",
    price: 28000
  },
  {
    id: 3,
    year: 2022,
    make: "Mazda",
    model: "MX-5 Miata",
    condition: "Used",
    mileage: 22000,
    imageURL: "https://media.ed.edmunds-media.com/mazda/hero/mazda_hero_502_1600.jpg",
    price: 29000
  },
  {
    id: 4,
    year: 2021,
    make: "Hyundai",
    model: "Elantra",
    condition: "Used",
    mileage: 35000,
    imageURL: "https://cimg0.ibsrv.net/ibimg/hgm/1920x1080-1/100/740/2021-hyundai-elantra_100740296.jpg",
    price: 21000
  },
  {
    id: 5,
    year: 2023,
    make: "Kia",
    model: "Forte",
    condition: "Used",
    mileage: 18000,
    imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0Ti2imnXCc6mJd_mxxy_kI9EvHfAtmFdI6A&s",
    price: 23000
  },
  {
    id: 6,
    year: 2024,
    make: "Volkswagen",
    model: "Jetta",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFcp48RVkeNLxWgrtENhoHa_MMYyCx4IG9gA&s",
    price: 27000
  },
  {
    id: 7,
    year: 2022,
    make: "Subaru",
    model: "Impreza",
    condition: "Used",
    mileage: 28000,
    imageURL: "https://media.ed.edmunds-media.com/subaru/impreza/2022/oem/2022_subaru_impreza_4dr-hatchback_limited_fq_oem_1_1600.jpg",
    price: 26000
  },

  // Mid-Range Cars ($30k-$60k)
  {
    id: 8,
    year: 2023,
    make: "Chevrolet",
    model: "Camaro",
    condition: "Used",
    mileage: 12000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2019-chevrolet-camaro-2-0t-1le-6mt-106-1539790974.jpg?crop=0.675xw:0.620xh;0.252xw,0.335xh&resize=2048:*",
    price: 35000
  },
  {
    id: 9,
    year: 2024,
    make: "Volkswagen",
    model: "Golf GTI",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://www.tonyvolkswagen.com/blogs/4424/wp-content/uploads/2024/11/2024-Volkswagen-Golf-GTI.jpg",
    price: 38000
  },
  {
    id: 10,
    year: 2023,
    make: "Audi",
    model: "A4",
    condition: "Used",
    mileage: 20000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/medium-6802-audia4-1654633069.jpg?crop=1.00xw:0.846xh;0,0.154xh&resize=2048:*",
    price: 42000
  },
  {
    id: 11,
    year: 2024,
    make: "Tesla",
    model: "Model 3",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://i.gaw.to/content/photos/61/09/610913-tesla-model-3-2024-enfin-une-vraie-voiture.jpeg",
    price: 45000
  },
  {
    id: 12,
    year: 2022,
    make: "Mercedes-Benz",
    model: "C-Class",
    condition: "Used",
    mileage: 25000,
    imageURL: "https://cdn.motor1.com/images/mgl/0eVX0V/s1/2022-mercedes-benz-c-class.jpg",
    price: 48000
  },
  {
    id: 13,
    year: 2023,
    make: "Ford",
    model: "Mustang GT",
    condition: "Used",
    mileage: 8000,
    imageURL: "https://media.ed.edmunds-media.com/ford/mustang/2022/oem/2022_ford_mustang_coupe_ecoboost-premium_fq_oem_1_1600.jpg",
    price: 52000
  },
  {
    id: 14,
    year: 2024,
    make: "BMW",
    model: "3 Series",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://media.ed.edmunds-media.com/bmw/3-series/2023/oem/2023_bmw_3-series_sedan_330i-xdrive_fq_oem_1_1280.jpg",
    price: 55000
  },
  {
    id: 15,
    year: 2022,
    make: "Lexus",
    model: "IS 350",
    condition: "Used",
    mileage: 18000,
    imageURL: "https://media.ed.edmunds-media.com/lexus/is-350/2022/oem/2022_lexus_is-350_sedan_f-sport_fq_oem_2_1600.jpg",
    price: 47000
  },
  {
    id: 16,
    year: 2023,
    make: "Acura",
    model: "TLX",
    condition: "Used",
    mileage: 15000,
    imageURL: "https://images.cars.com/cldstatic/wp-content/uploads/acura-tlx-type-s-2023-exterior-oem-01.jpg",
    price: 44000
  },

  // Performance & Luxury ($60k-$120k)
  {
    id: 17,
    year: 2023,
    make: "BMW",
    model: "M4",
    condition: "Used",
    mileage: 5000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2023-bmw-m4-csl-111-1652905671.jpg?crop=0.891xw:0.753xh;0.109xw,0.247xh&resize=2048:*",
    price: 75000
  },
  {
    id: 18,
    year: 2024,
    make: "Tesla",
    model: "Model S",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2024-tesla-model-s-107-6572200e43fa1.jpg?crop=0.473xw:0.355xh;0.254xw,0.341xh&resize=1200:*",
    price: 95000
  },
  {
    id: 19,
    year: 2023,
    make: "Mercedes-Benz",
    model: "AMG C 63",
    condition: "Used",
    mileage: 10000,
    imageURL: "https://s1.cdn.autoevolution.com/images/news/2023-mercedes-amg-c-63-s-e-performance-rocks-four-cylinder-phev-setup-with-671-hp-199218-7.jpg",
    price: 82000
  },
  {
    id: 20,
    year: 2024,
    make: "Audi",
    model: "RS5",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2024-audi-rs5-sportback-101-64ad735ff3ac8.jpg?crop=0.601xw:0.507xh;0.249xw,0.410xh&resize=2048:*",
    price: 88000
  },
  {
    id: 21,
    year: 2022,
    make: "Porsche",
    model: "Cayman S",
    condition: "Used",
    mileage: 12000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2021-porsche-718-cayman-gt4-107-1616160477.jpg?crop=0.731xw:0.615xh;0.136xw,0.192xh&resize=2048:*",
    price: 78000
  },
  {
    id: 22,
    year: 2023,
    make: "Corvette",
    model: "C8 Stingray",
    condition: "Used",
    mileage: 7000,
    imageURL: "https://www.edmunds.com/assets/m/chevrolet/corvette/2023/oem/2023_chevrolet_corvette_coupe_stingray_fq_oem_1_600.jpg",
    price: 85000
  },
  {
    id: 23,
    year: 2024,
    make: "Jaguar",
    model: "F-Type",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://cdn.jdpower.com/JDP_2024%20Jaguar%20F-Type%20R75%20Convertible%20Giola%20Green%20Front%20Quarter%20View.jpg",
    price: 92000
  },
  {
    id: 24,
    year: 2022,
    make: "Mercedes-Benz",
    model: "E-Class",
    condition: "Used",
    mileage: 22000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2021-mercedes-benz-e450-4matic-sedan-107-1604280340.jpg?crop=0.728xw:0.613xh;0.181xw,0.240xh&resize=2048:*",
    price: 65000
  },
  {
    id: 25,
    year: 2023,
    make: "BMW",
    model: "X5 M",
    condition: "Used",
    mileage: 15000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2021-bmw-x5-m-competition-101-1644233593.jpg?crop=0.614xw:0.518xh;0.279xw,0.350xh&resize=2048:*",
    price: 98000
  },
  {
    id: 26,
    year: 2023,
    make: "Nissan",
    model: "GT-R",
    condition: "Used",
    mileage: 8000,
    imageURL: "https://media.ed.edmunds-media.com/nissan/gt-r/2023/oem/2023_nissan_gt-r_coupe_premium_fq_oem_6_1600.jpg",
    price: 115000
  },

  // High-End Luxury ($120k-$200k)
  {
    id: 27,
    year: 2023,
    make: "Porsche",
    model: "911 Carrera",
    condition: "Used",
    mileage: 6000,
    imageURL: "https://media.ed.edmunds-media.com/porsche/911/2023/oem/2023_porsche_911_coupe_carrera-4-gts_fq_oem_1_1600.jpg",
    price: 125000
  },
  {
    id: 28,
    year: 2024,
    make: "Mercedes-Benz",
    model: "S-Class",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://i.gaw.to/vehicles/photos/40/35/403538-2024-mercedes-benz-s-class.jpg?1024x640",
    price: 135000
  },
  {
    id: 29,
    year: 2023,
    make: "BMW",
    model: "M8 Competition",
    condition: "Used",
    mileage: 4000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2020-bmw-m8-competition-coupe-104-1570575778.jpg?crop=0.852xw:0.719xh;0.0570xw,0.193xh&resize=2048:*",
    price: 145000
  },
  {
    id: 30,
    year: 2024,
    make: "Audi",
    model: "R8",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://robbreport.com/wp-content/uploads/2024/03/audir8.jpg",
    price: 165000
  },
  {
    id: 31,
    year: 2023,
    make: "Porsche",
    model: "Taycan Turbo S",
    condition: "Used",
    mileage: 9000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2022-porsche-taycan-sport-turismo-gts-19-1638148404.jpg?crop=0.800xw:0.673xh;0.104xw,0.244xh&resize=1200:*",
    price: 155000
  },
  {
    id: 32,
    year: 2022,
    make: "Bentley",
    model: "Continental GT",
    condition: "Used",
    mileage: 12000,
    imageURL: "https://www.edmunds.com/assets/m/bentley/continental/2022/oem/2022_bentley_continental_convertible_gt-speed_fq_oem_1_600.jpg",
    price: 175000
  },
  {
    id: 33,
    year: 2024,
    make: "Maserati",
    model: "MC20",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://bringatrailer.com/wp-content/uploads/2024/09/2024_maserati_mc20-coupe_2024_maserati_mc20-coupe_6716d8f2-1b95-4241-9e72-6e4679bef300-kt4lat-53837-74908.jpg?fit=1894%2C1263",
    price: 185000
  },
  {
    id: 34,
    year: 2023,
    make: "Aston Martin",
    model: "DB11",
    condition: "Used",
    mileage: 7000,
    imageURL: "https://hips.hearstapps.com/mtg-prod/659f04fc095f610008e66e2f/2023-aston-martin-db11-v8-front-three-quarter-in-motion-02.jpg",
    price: 195000
  },

  // Supercars ($200k+)
  {
    id: 35,
    year: 2023,
    make: "Lamborghini",
    model: "Huracán EVO",
    condition: "Used",
    mileage: 3000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2022-lamborghini-huracan-tecnica-101-1657303967.jpg?crop=0.704xw:0.594xh;0.0619xw,0.301xh&resize=2048:*",
    price: 250000
  },
  {
    id: 36,
    year: 2022,
    make: "Ferrari",
    model: "F8 Tributo",
    condition: "Used",
    mileage: 5000,
    imageURL: "https://i.gaw.to/vehicles/photos/40/26/402621-2022-ferrari-f8.jpg?1024x640",
    price: 280000
  },
  {
    id: 37,
    year: 2024,
    make: "McLaren",
    model: "720S",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://luxurylaunches.com/wp-content/uploads/2023/04/mclaren-750s.jpg",
    price: 315000
  },
  {
    id: 38,
    year: 2023,
    make: "Lamborghini",
    model: "Aventador SVJ",
    condition: "Used",
    mileage: 2000,
    imageURL: "https://autotraderau-res.cloudinary.com/image/upload/e_trim:10,f_auto/c_scale,t_cg_base,w_678/glasses/zIDOVBDM.jpg",
    price: 420000
  },
  {
    id: 39,
    year: 2024,
    make: "Ferrari",
    model: "SF90 Stradale",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2024-ferrari-sf90-xx-stradale-122-654a66978f827.jpg?crop=0.623xw:0.622xh;0.221xw,0.244xh&resize=1200:*",
    price: 625000
  },
  {
    id: 40,
    year: 2023,
    make: "Porsche",
    model: "911 GT3 RS",
    condition: "Used",
    mileage: 1500,
    imageURL: "https://images.pistonheads.com/nimg/47438/blobid0.jpg",
    price: 285000
  },
  {
    id: 41,
    year: 2024,
    make: "McLaren",
    model: "765LT",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://autotraderau-res.cloudinary.com/image/upload/e_trim:10,f_auto/c_scale,t_cg_base,w_678/glasses/0IzRQVEM.jpg",
    price: 395000
  },
  {
    id: 42,
    year: 2022,
    make: "Bugatti",
    model: "Chiron",
    condition: "Used",
    mileage: 800,
    imageURL: "https://www.carscoops.com/wp-content/uploads/2022/10/2022-Bugatti-Chiron-No-400-6.jpg",
    price: 2950000
  },
  {
    id: 43,
    year: 2023,
    make: "Rolls-Royce",
    model: "Phantom",
    condition: "Used",
    mileage: 5000,
    imageURL: "https://media.ed.edmunds-media.com/rolls-royce/phantom/2023/oem/2023_rolls-royce_phantom_sedan_base_fq_oem_10_1600.jpg",
    price: 485000
  },
  {
    id: 44,
    year: 2024,
    make: "Lamborghini",
    model: "Urus",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://www.thedrive.com/wp-content/uploads/2024/08/2024-Lamborghini-Urus-1.jpg?quality=85",
    price: 245000
  },
  {
    id: 45,
    year: 2023,
    make: "Mercedes-AMG",
    model: "GT Black Series",
    condition: "Used",
    mileage: 2500,
    imageURL: "https://www.topgear.com/sites/default/files/cars-car/image/2020/09/_atf5691.jpeg",
    price: 385000
  },

  // Additional Popular Models
  {
    id: 46,
    year: 2024,
    make: "Toyota",
    model: "Camry",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://www.edmunds.com/assets/m/cs/blt95cf4db396c717b7/672bda61733622566a9c6cac/2024-toyota-camry-actf34.jpg",
    price: 32000
  },
  {
    id: 47,
    year: 2023,
    make: "Honda",
    model: "Accord",
    condition: "Used",
    mileage: 16000,
    imageURL: "https://www.edmunds.com/assets/m/honda/accord/2023/oem/2023_honda_accord_sedan_sport-l-hybrid_fq_oem_1_600.jpg",
    price: 34000
  },
  {
    id: 48,
    year: 2024,
    make: "Ford",
    model: "F-150 Lightning",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://di-uploads-pod45.dealerinspire.com/donfranklinfordlondon/uploads/2024/11/2024-Ford-F-150-Lightning.jpg",
    price: 58000
  },
  {
    id: 49,
    year: 2022,
    make: "Dodge",
    model: "Challenger SRT Hellcat",
    condition: "Used",
    mileage: 9000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2022-dodge-challenger-srt-hellcat-super-stock-mmp-1-1634585571.jpg",
    price: 68000
  },
  {
    id: 50,
    year: 2024,
    make: "Genesis",
    model: "G70",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://smartcdn.gprod.postmedia.digital/driving/wp-content/uploads/2024/02/2024-Genesis-G70-GF2.jpg",
    price: 46000
  },

  // Additional Budget & Economy Cars
  {
    id: 51,
    year: 2023,
    make: "Nissan",
    model: "Sentra",
    condition: "Used",
    mileage: 24000,
    imageURL: "https://di-uploads-pod40.dealerinspire.com/nissanofjeffersoncity/uploads/2023/04/2023-NISSAN-SENTRA-PERFORMANCE.jpg",
    price: 22000
  },
  {
    id: 52,
    year: 2024,
    make: "Mazda",
    model: "Mazda3",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://media.ed.edmunds-media.com/mazda/3/2024/oem/2024_mazda_3_4dr-hatchback_25-s-carbon-edition_fq_oem_1_1600.jpg",
    price: 26000
  },
  {
    id: 53,
    year: 2021,
    make: "Chevrolet",
    model: "Malibu",
    condition: "Used",
    mileage: 42000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2021-chevrolet-malibu-mmp-1-1598373352.jpg?crop=0.982xw:0.846xh;0.00641xw,0.122xh&resize=2048:*",
    price: 19000
  },
  {
    id: 54,
    year: 2023,
    make: "Toyota",
    model: "Prius",
    condition: "Used",
    mileage: 20000,
    imageURL: "https://toyotacanada.scene7.com/is/image/toyotacanada/2023_Prius_Limited_ReservoirBlue_001?ts=1696207870625&$Media-Large$&dpr=off",
    price: 27000
  },
  {
    id: 55,
    year: 2022,
    make: "Ford",
    model: "Focus ST",
    condition: "Used",
    mileage: 30000,
    imageURL: "https://www.onlycars.com.au/img/news/ford%20focus%20st%20res-02106.jpg",
    price: 24000
  },
  {
    id: 56,
    year: 2024,
    make: "Subaru",
    model: "WRX",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://cdn-fastly.autoguide.com/media/2024/05/14/11271/2024-subaru-wrx-rs-review-track-upgrades-make-a-more-fun-road-car.jpg?size=720x845&nocrop=1",
    price: 33000
  },

  // SUVs & Crossovers
  {
    id: 57,
    year: 2023,
    make: "Toyota",
    model: "RAV4",
    condition: "Used",
    mileage: 18000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2023-toyota-rav4-101-1666018775.jpg?crop=0.587xw:0.587xh;0.207xw,0.336xh&resize=1200:*",
    price: 36000
  },
  {
    id: 58,
    year: 2024,
    make: "Honda",
    model: "CR-V",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2024-honda-cr-v-101-661024514d1a1.jpg?crop=0.766xw:0.649xh;0.119xw,0.214xh&resize=2048:*",
    price: 38000
  },
  {
    id: 59,
    year: 2022,
    make: "Mazda",
    model: "CX-5",
    condition: "Used",
    mileage: 25000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2022-mazda-cx-5-2p5-turbo-signature-104-1657559238.jpg?crop=0.710xw:0.599xh;0.170xw,0.288xh&resize=2048:*",
    price: 31000
  },
  {
    id: 60,
    year: 2023,
    make: "Jeep",
    model: "Grand Cherokee",
    condition: "Used",
    mileage: 15000,
    imageURL: "https://www.thedrive.com/wp-content/uploads/2024/02/06/2023-jeep-grand-cherokee-review-1.jpg?quality=85",
    price: 45000
  },
  {
    id: 61,
    year: 2024,
    make: "Ford",
    model: "Explorer",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://media.ed.edmunds-media.com/ford/explorer/2023/oem/2023_ford_explorer_4dr-suv_king-ranch_fq_oem_1_1280.jpg",
    price: 49000
  },
  {
    id: 62,
    year: 2023,
    make: "Chevrolet",
    model: "Tahoe",
    condition: "Used",
    mileage: 20000,
    imageURL: "https://media.ed.edmunds-media.com/chevrolet/tahoe/2023/oem/2023_chevrolet_tahoe_4dr-suv_high-country_fq_oem_1_1600.jpg",
    price: 58000
  },
  {
    id: 63,
    year: 2024,
    make: "BMW",
    model: "X3",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2024-bmw-x3-101-64e782a68ab3d.jpg?crop=0.945xw:0.809xh;0,0.156xh&resize=2048:*",
    price: 52000
  },
  {
    id: 64,
    year: 2023,
    make: "Audi",
    model: "Q5",
    condition: "Used",
    mileage: 14000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2021-audi-q5-phev-premium-plus-202-1642524019.jpg?crop=0.767xw:0.646xh;0.233xw,0.354xh&resize=1200:*",
    price: 48000
  },
  {
    id: 65,
    year: 2024,
    make: "Mercedes-Benz",
    model: "GLE 450",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://cdn-fastly.autoguide.com/media/2023/06/29/13441990/mercedes-benz-gle-review-specs-pricing-features-videos-and-more.jpg?size=1200x628",
    price: 72000
  },
  {
    id: 66,
    year: 2023,
    make: "Lexus",
    model: "RX 350",
    condition: "Used",
    mileage: 12000,
    imageURL: "https://di-uploads-pod23.s3.us-east-1.amazonaws.com/thompsonlexuswillowgrove/uploads/2023/06/Blue-RX.gif",
    price: 54000
  },
  {
    id: 67,
    year: 2024,
    make: "Porsche",
    model: "Cayenne",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2024-porsche-cayenne-turbo-gt-031-a9202323-645e5da0d747c.jpg?crop=0.755xw:0.638xh;0.196xw,0.293xh&resize=640:*",
    price: 88000
  },
  {
    id: 68,
    year: 2023,
    make: "Range Rover",
    model: "Sport",
    condition: "Used",
    mileage: 10000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2023-land-rover-range-rover-sport-se-p360-19-63fe16f5eecca.jpg?crop=0.684xw:0.576xh;0.234xw,0.321xh&resize=2048:*",
    price: 95000
  },

  // Pickup Trucks
  {
    id: 69,
    year: 2023,
    make: "Ford",
    model: "F-150",
    condition: "Used",
    mileage: 28000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2023-f-150-rattler-01-1648495659.jpg?crop=0.708xw:0.472xh;0.159xw,0.274xh&resize=1200:*",
    price: 42000
  },
  {
    id: 70,
    year: 2024,
    make: "Chevrolet",
    model: "Silverado",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2024-chevrolet-silverado-1500-high-country-102-642dbddbe725d.jpg?crop=0.788xw:0.666xh;0.171xw,0.212xh&resize=2048:*",
    price: 48000
  },
  {
    id: 71,
    year: 2022,
    make: "RAM",
    model: "1500",
    condition: "Used",
    mileage: 35000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2022-ram-1500-backcountry-special-edition-104-1625851347.jpg",
    price: 39000
  },
  {
    id: 72,
    year: 2023,
    make: "Toyota",
    model: "Tundra",
    condition: "Used",
    mileage: 22000,
    imageURL: "https://media.ed.edmunds-media.com/toyota/tundra/2023/oem/2023_toyota_tundra_crew-cab-pickup_1794-edition_fq_oem_1_1600.jpg",
    price: 51000
  },
  {
    id: 73,
    year: 2024,
    make: "GMC",
    model: "Sierra Denali",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2022-gmc-sierra-1500-denali-ultimate-101-1652106391.jpg?crop=0.853xw:0.721xh;0.0244xw,0.164xh&resize=2048:*",
    price: 65000
  },

  // Electric & Hybrid Vehicles
  {
    id: 74,
    year: 2024,
    make: "Tesla",
    model: "Model Y",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2020-tesla-model-y-long-range-101-1592842279.jpg?crop=0.590xw:0.499xh;0.319xw,0.364xh&resize=2048:*",
    price: 54000
  },
  {
    id: 75,
    year: 2023,
    make: "Tesla",
    model: "Model X",
    condition: "Used",
    mileage: 11000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2023-tesla-model-x-101-1671475309.jpeg?crop=0.404xw:0.364xh;0.381xw,0.295xh&resize=2048:*",
    price: 89000
  },
  {
    id: 76,
    year: 2024,
    make: "Rivian",
    model: "R1T",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2022-rivian-r1t-first-edition-urbano-103-1643302430.jpg?crop=0.418xw:0.353xh;0.423xw,0.351xh&resize=2048:*",
    price: 78000
  },
  {
    id: 77,
    year: 2023,
    make: "Lucid",
    model: "Air",
    condition: "Used",
    mileage: 8000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2023-lucid-air-touring-9444-1675346750.jpg?crop=0.681xw:0.512xh;0.122xw,0.358xh&resize=1200:*",
    price: 92000
  },
  {
    id: 78,
    year: 2024,
    make: "Polestar",
    model: "2",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2024-polestar-2-single-motor-103-656765210c935.jpg?crop=0.571xw:0.428xh;0.324xw,0.457xh&resize=1200:*",
    price: 51000
  },
  {
    id: 79,
    year: 2023,
    make: "BMW",
    model: "i4",
    condition: "Used",
    mileage: 9000,
    imageURL: "https://www.cnet.com/a/img/resize/e54c4af3ab00e6673a3d2851e1bea7729f30b6d2/hub/2022/10/13/08448dfe-938c-4533-bf39-b2a48ec08436/bmw-i4-m50-2022-734311.jpg?auto=webp&width=1200",
    price: 62000
  },
  {
    id: 80,
    year: 2024,
    make: "Mercedes-Benz",
    model: "EQS",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://media.ed.edmunds-media.com/mercedes-benz/eqs/2024/oem/2024_mercedes-benz_eqs_sedan_amg-eqs_fq_oem_1_1600.jpg",
    price: 105000
  },
  {
    id: 81,
    year: 2023,
    make: "Audi",
    model: "e-tron GT",
    condition: "Used",
    mileage: 7000,
    imageURL: "https://media.ed.edmunds-media.com/audi/e-tron-gt/2022/oem/2022_audi_e-tron-gt_sedan_prestige_fq_oem_1_1600.jpg",
    price: 98000
  },

  // Additional Performance Cars
  {
    id: 82,
    year: 2023,
    make: "Alfa Romeo",
    model: "Giulia Quadrifoglio",
    condition: "Used",
    mileage: 11000,
    imageURL: "https://bringatrailer.com/wp-content/uploads/2024/08/2023_alfa-romeo_giulia-quadrifoglio_2023_alfa-romeo_giulia-quadrifoglio_b39b6826-2608-4e99-accc-2902847af436-lxqxpm-76203-48525.jpg",
    price: 64000
  },
  {
    id: 83,
    year: 2024,
    make: "Cadillac",
    model: "CT5-V Blackwing",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://www.thedrive.com/wp-content/uploads/2024/10/2024-cadillac-ct5v-blackwing-test-drive-jerry-perez-2.jpg?quality=85",
    price: 95000
  },
  {
    id: 84,
    year: 2022,
    make: "Lexus",
    model: "LC 500",
    condition: "Used",
    mileage: 13000,
    imageURL: "https://media.ed.edmunds-media.com/lexus/lc-500h/2022/oem/2022_lexus_lc-500h_coupe_base_fq_oem_1_1600.jpg",
    price: 78000
  },
  {
    id: 85,
    year: 2023,
    make: "BMW",
    model: "M3",
    condition: "Used",
    mileage: 8000,
    imageURL: "https://news.dupontregistry.com/wp-content/uploads/2023/07/2023-bmw-m3-edition-50-jahre-scaled.jpg",
    price: 73000
  },
  {
    id: 86,
    year: 2024,
    make: "Mercedes-AMG",
    model: "E 63 S",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2023-mercedes-amg-e63-s-4matic-103-1671563913.jpg?crop=0.554xw:0.467xh;0.274xw,0.396xh&resize=2048:*",
    price: 112000
  },
  {
    id: 87,
    year: 2023,
    make: "Porsche",
    model: "Panamera Turbo",
    condition: "Used",
    mileage: 6000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2023-porsche-panamera-turbo-s-102-1671562605.jpg",
    price: 138000
  },

  // Ultra-Luxury Cars
  {
    id: 88,
    year: 2024,
    make: "Bentley",
    model: "Flying Spur",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://d3s8goeblmpptu.cloudfront.net/mrp/bentley/2024/flying-spur/2024-bentley-flying-spur_landing_638640.jpg",
    price: 225000
  },
  {
    id: 89,
    year: 2023,
    make: "Rolls-Royce",
    model: "Ghost",
    condition: "Used",
    mileage: 3000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2023-rolls-royce-black-badge-101-1673365072.jpeg?crop=0.774xw:0.579xh;0.130xw,0.227xh&resize=1200:*",
    price: 315000
  },
  {
    id: 90,
    year: 2024,
    make: "Aston Martin",
    model: "DBS Superleggera",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://static0.topspeedimages.com/wordpress/wp-content/uploads/2023/04/resize_dbs_superleggera.jpg",
    price: 335000
  },
  {
    id: 91,
    year: 2023,
    make: "Ferrari",
    model: "Roma",
    condition: "Used",
    mileage: 4000,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2024-ferrari-roma-spider-117-650b3c92b4ae2.jpg?crop=0.724xw:0.542xh;0.184xw,0.422xh&resize=1200:*",
    price: 245000
  },
  {
    id: 92,
    year: 2024,
    make: "Lamborghini",
    model: "Revuelto",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2024-lamborghini-revuelto-125-67aa477039191.jpg?crop=0.623xw:0.524xh;0.272xw,0.376xh&resize=1200:*",
    price: 608000
  },
  {
    id: 93,
    year: 2023,
    make: "McLaren",
    model: "Artura",
    condition: "Used",
    mileage: 2500,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/2023-mclaren-artura3-6400f567986ad.jpg?crop=0.479xw:0.404xh;0.245xw,0.370xh&resize=1200:*",
    price: 235000
  },
  {
    id: 94,
    year: 2024,
    make: "Porsche",
    model: "918 Spyder",
    condition: "Used",
    mileage: 1200,
    imageURL: "https://www.stuttcars.com/wp-content/uploads/2022/01/Porsche-918-Spyder.jpeg",
    price: 1850000
  },
  {
    id: 95,
    year: 2023,
    make: "Pagani",
    model: "Huayra",
    condition: "Used",
    mileage: 600,
    imageURL: "https://www.topgear.com/sites/default/files/2023/01/1_7.jpg",
    price: 2800000
  },
  {
    id: 96,
    year: 2024,
    make: "Koenigsegg",
    model: "Jesko",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://www.supervettura.com/blobs/Cars/88/47f4b814-246a-4f02-a7bf-6acbc71bfa19.jpg?width=1920&height=1080&mode=crop",
    price: 3200000
  },
  {
    id: 97,
    year: 2023,
    make: "Ferrari",
    model: "LaFerrari",
    condition: "Used",
    mileage: 800,
    imageURL: "https://news.dupontregistry.com/wp-content/uploads/2022/01/5d94da3ad6f4125e09942efa-ferrari-laferrari-2013-engine-focuson-desktop-01-scaled.jpeg",
    price: 3500000
  },
  {
    id: 98,
    year: 2022,
    make: "McLaren",
    model: "Speedtail",
    condition: "Used",
    mileage: 950,
    imageURL: "https://s1.cdn.autoevolution.com/images/news/gallery/2022-mclaren-speedtail-easily-morphs-into-f1-and-p1-gtr-inspired-track-monster_2.jpg",
    price: 2950000
  },
  {
    id: 99,
    year: 2024,
    make: "Aston Martin",
    model: "Valkyrie",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://www.topgear.com/sites/default/files/2023/03/1-Aston-Martin-Valkyrie.jpg",
    price: 3500000
  },
  {
    id: 100,
    year: 2023,
    make: "Bugatti",
    model: "Mistral",
    condition: "Brand New",
    mileage: 0,
    imageURL: "https://hips.hearstapps.com/hmg-prod/images/12-bugatti-roadster-launch-set-1660747790.jpg",
    price: 5000000
  }
];
