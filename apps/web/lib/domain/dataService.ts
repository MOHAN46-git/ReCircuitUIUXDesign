import {
  Profile,
  ComponentCatalogItem,
  Project,
  Listing,
  UserInventoryItem,
  Order,
  PaymentDemo,
  HandoverVerification,
  ImpactEvent,
  EWasteSubmission
} from '@/types';

// In-Memory Seed Storage for Instant Running & Offline Resilience
export const SEED_PROFILES: Profile[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    role: 'seller',
    first_name: 'Priya',
    last_name: 'Sharma',
    email: 'priya.maker@recircuit.org',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    phone: '+91 98765 43210',
    organization: 'GreenCircuit Makerspace',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    role: 'buyer',
    first_name: 'Vikram',
    last_name: 'Patel',
    email: 'vikram.student@saveetha.ac.in',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    phone: '+91 98765 12345',
    organization: 'Saveetha School of Engineering',
    verification_status: 'demo_verified',
    created_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    role: 'institution',
    first_name: 'Dr. Ramesh',
    last_name: 'Sundaram',
    email: 'ramesh.lab@recircuit.org',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    phone: '+91 94440 98765',
    organization: 'IoT & Robotics Circular Lab',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
  }
];

export const SEED_CATALOG: ComponentCatalogItem[] = [
  {
    id: 'c0000001-0000-0000-0000-000000000001',
    canonical_name: 'ESP32 DevKit V1',
    aliases: ['esp32', 'esp-32', 'esp wroom 32', 'nodemcu 32'],
    category: 'Microcontrollers',
    description: 'Dual-core 32-bit MCU with built-in Wi-Fi and Bluetooth BLE.',
    default_mass_g: 35.0,
  },
  {
    id: 'c0000002-0000-0000-0000-000000000002',
    canonical_name: 'Arduino Uno R3',
    aliases: ['arduino uno', 'uno r3', 'atmega328p board', 'uno'],
    category: 'Microcontrollers',
    description: 'ATmega328P based microcontroller board with 14 digital I/O pins.',
    default_mass_g: 45.0,
  },
  {
    id: 'c0000003-0000-0000-0000-000000000003',
    canonical_name: 'Ultrasonic Sensor HC-SR04',
    aliases: ['hc-sr04', 'ultrasonic sensor', 'hcsr04', 'distance sensor'],
    category: 'Sensors',
    description: '2cm to 400cm non-contact distance measurement module.',
    default_mass_g: 15.0,
  },
  {
    id: 'c0000004-0000-0000-0000-000000000004',
    canonical_name: 'Soil Moisture Sensor Capacitive',
    aliases: ['soil sensor', 'soil moisture', 'capacitive soil sensor', 'hygrometer'],
    category: 'Sensors',
    description: 'Analog/digital soil moisture sensing probe for irrigation.',
    default_mass_g: 20.0,
  },
  {
    id: 'c0000005-0000-0000-0000-000000000005',
    canonical_name: '5V Single Channel Relay Module',
    aliases: ['relay', '5v relay', '1-channel relay', 'relay module'],
    category: 'Actuators',
    description: 'Optocoupler isolated relay switch for AC/DC load control up to 10A.',
    default_mass_g: 25.0,
  },
  {
    id: 'c0000006-0000-0000-0000-000000000006',
    canonical_name: 'Mini Submersible Water Pump 5V',
    aliases: ['mini pump', 'water pump', '5v pump', 'dc water pump'],
    category: 'Actuators',
    description: 'Compact low-noise DC submersible pump for automated watering.',
    default_mass_g: 85.0,
  },
  {
    id: 'c0000007-0000-0000-0000-000000000007',
    canonical_name: 'L298N Dual H-Bridge Motor Driver',
    aliases: ['l298n', 'motor driver', 'dual h-bridge', 'dc motor driver'],
    category: 'Drivers',
    description: 'High-power motor driver module for dual DC motors or stepper.',
    default_mass_g: 40.0,
  },
  {
    id: 'c0000008-0000-0000-0000-000000000008',
    canonical_name: 'TT Dual Shaft Gear Motor 3-6V',
    aliases: ['tt motor', 'gear motor', 'bo motor', 'dc gear motor'],
    category: 'Actuators',
    description: 'Yellow reduction gearbox DC motor with high torque for robotics.',
    default_mass_g: 30.0,
  },
  {
    id: 'c0000009-0000-0000-0000-000000000009',
    canonical_name: 'Servo Motor SG90 Micro 9g',
    aliases: ['sg90', 'servo', 'micro servo', '9g servo'],
    category: 'Actuators',
    description: '180 degree rotation micro servo motor with horns and gears.',
    default_mass_g: 12.0,
  },
  {
    id: 'c0000010-0000-0000-0000-00000000010',
    canonical_name: 'DHT11 Temperature & Humidity Sensor',
    aliases: ['dht11', 'dht-11', 'temp sensor', 'humidity sensor'],
    category: 'Sensors',
    description: 'Calibrated digital signal output temperature and humidity sensor.',
    default_mass_g: 10.0,
  },
  {
    id: 'c0000011-0000-0000-0000-00000000011',
    canonical_name: '16x2 I2C Character LCD Display',
    aliases: ['1602 lcd', 'i2c lcd', '16x2 lcd', 'character display'],
    category: 'Displays',
    description: 'HD44780 standard 16x2 blue backlight display with PCF8574 I2C adapter.',
    default_mass_g: 40.0,
  },
  {
    id: 'c0000012-0000-0000-0000-00000000012',
    canonical_name: 'PIR Motion Sensor HC-SR501',
    aliases: ['pir sensor', 'hc-sr501', 'motion sensor', 'pyroelectric sensor'],
    category: 'Sensors',
    description: 'Passive infrared sensor detecting human or obstacle body movement.',
    default_mass_g: 18.0,
  },
  {
    id: 'c0000013-0000-0000-0000-00000000013',
    canonical_name: 'Active Buzzer Module 5V',
    aliases: ['buzzer', 'active buzzer', 'alarm buzzer', 'piezo buzzer'],
    category: 'Indicators',
    description: 'Continuous audio tone transducer with internal oscillation.',
    default_mass_g: 6.0,
  },
  {
    id: 'c0000014-0000-0000-0000-00000000014',
    canonical_name: 'TCRT5000 Infrared Line Tracking Sensor',
    aliases: ['tcrt5000', 'line sensor', 'ir tracking sensor', 'line follower sensor'],
    category: 'Sensors',
    description: 'Phototransistor reflective optical sensor for path detection.',
    default_mass_g: 12.0,
  },
  {
    id: 'c0000015-0000-0000-0000-00000000015',
    canonical_name: 'Breadboard 830 Points & Jumper Pack',
    aliases: ['breadboard', 'jumper wires', 'prototyping board', 'wires pack'],
    category: 'Prototyping',
    description: 'Standard solderless breadboard with 65-piece male-to-male jumper wires.',
    default_mass_g: 95.0,
  },
  {
    id: 'c0000016-0000-0000-0000-00000000016',
    canonical_name: 'Lithium 18650 Battery Holder & BMS 2S',
    aliases: ['18650 holder', 'battery pack', '2s bms', 'battery shield'],
    category: 'Power',
    description: 'Dual cell 18650 battery holder with integrated 7.4V protection circuit.',
    default_mass_g: 55.0,
  }
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'p0000001-0000-0000-0000-000000000001',
    title: 'Smart Plant Irrigation System',
    slug: 'smart-irrigation',
    description: 'Automated moisture-sensing drip irrigation controller with relay and submersible pump.',
    difficulty: 'Beginner',
    category: 'Agriculture & IoT',
    estimated_reuse_g: 280.0,
    image_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
    instructions: 'Wire soil sensor to ESP32 ADC pin, connect relay IN to GPIO4, trigger pump when moisture drops below 30%.',
    status: 'active',
    requirements: [
      { id: 'r1', project_id: 'p1', component_id: 'c0000001-0000-0000-0000-000000000001', required_qty: 1, critical: true, weight: 1.5 },
      { id: 'r2', project_id: 'p1', component_id: 'c0000004-0000-0000-0000-000000000004', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r3', project_id: 'p1', component_id: 'c0000005-0000-0000-0000-000000000005', required_qty: 1, critical: true, weight: 1.0 },
      { id: 'r4', project_id: 'p1', component_id: 'c0000006-0000-0000-0000-000000000006', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r5', project_id: 'p1', component_id: 'c0000015-0000-0000-0000-000000000015', required_qty: 1, critical: false, weight: 0.5 },
    ]
  },
  {
    id: 'p0000002-0000-0000-0000-000000000002',
    title: 'Autonomous Obstacle Avoiding Robot',
    slug: 'obstacle-robot',
    description: 'Two-wheel rover using HC-SR04 ultrasonic rangefinder and L298N driver to navigate rooms safely.',
    difficulty: 'Intermediate',
    category: 'Robotics',
    estimated_reuse_g: 390.0,
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
    instructions: 'Mount ultrasonic sensor on SG90 servo. Sweep 45-135 degrees. Reverse when distance < 15cm.',
    status: 'active',
    requirements: [
      { id: 'r6', project_id: 'p2', component_id: 'c0000002-0000-0000-0000-000000000002', required_qty: 1, critical: true, weight: 1.5 },
      { id: 'r7', project_id: 'p2', component_id: 'c0000003-0000-0000-0000-000000000003', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r8', project_id: 'p2', component_id: 'c0000007-0000-0000-0000-000000000007', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r9', project_id: 'p2', component_id: 'c0000008-0000-0000-0000-000000000008', required_qty: 2, critical: true, weight: 1.0 },
      { id: 'r10', project_id: 'p2', component_id: 'c0000009-0000-0000-0000-000000000009', required_qty: 1, critical: false, weight: 0.8 },
      { id: 'r11', project_id: 'p2', component_id: 'c0000016-0000-0000-0000-000000000016', required_qty: 1, critical: true, weight: 1.0 },
    ]
  },
  {
    id: 'p0000003-0000-0000-0000-000000000003',
    title: 'Bluetooth RC Rover / Car',
    slug: 'rc-car-rover',
    description: 'Remote controlled motorized chassis driven wirelessly via smartphone Bluetooth through ESP32.',
    difficulty: 'Beginner',
    category: 'Robotics',
    estimated_reuse_g: 320.0,
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    instructions: 'Pair Android Bluetooth Serial Controller with ESP32 BT Classic. Translate directional commands to L298N outputs.',
    status: 'active',
    requirements: [
      { id: 'r12', project_id: 'p3', component_id: 'c0000001-0000-0000-0000-000000000001', required_qty: 1, critical: true, weight: 1.5 },
      { id: 'r13', project_id: 'p3', component_id: 'c0000007-0000-0000-0000-000000000007', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r14', project_id: 'p3', component_id: 'c0000008-0000-0000-0000-000000000008', required_qty: 2, critical: true, weight: 1.0 },
      { id: 'r15', project_id: 'p3', component_id: 'c0000016-0000-0000-0000-000000000016', required_qty: 1, critical: true, weight: 1.0 },
    ]
  },
  {
    id: 'p0000004-0000-0000-0000-000000000004',
    title: 'IoT Weather Monitoring Station',
    slug: 'weather-monitor',
    description: 'Live temperature, humidity, and cloud metrics display with I2C 16x2 LCD and Wi-Fi sync.',
    difficulty: 'Beginner',
    category: 'IoT & Sensors',
    estimated_reuse_g: 185.0,
    image_url: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=600&q=80',
    instructions: 'Read DHT11 sensor periodically, format strings, push to Adafruit IO and update local I2C LCD.',
    status: 'active',
    requirements: [
      { id: 'r16', project_id: 'p4', component_id: 'c0000001-0000-0000-0000-000000000001', required_qty: 1, critical: true, weight: 1.5 },
      { id: 'r17', project_id: 'p4', component_id: 'c0000010-0000-0000-0000-00000000010', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r18', project_id: 'p4', component_id: 'c0000011-0000-0000-0000-00000000011', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r19', project_id: 'p4', component_id: 'c0000015-0000-0000-0000-000000000015', required_qty: 1, critical: false, weight: 0.5 },
    ]
  },
  {
    id: 'p0000005-0000-0000-0000-000000000005',
    title: 'Automatic Smart Night Lamp',
    slug: 'smart-night-lamp',
    description: 'Energy-saving light controller activated by human presence and low ambient illumination.',
    difficulty: 'Beginner',
    category: 'Home Automation',
    estimated_reuse_g: 170.0,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    instructions: 'PIR sensor triggers relay switch for LED lamp for 60 seconds upon detecting motion.',
    status: 'active',
    requirements: [
      { id: 'r20', project_id: 'p5', component_id: 'c0000002-0000-0000-0000-000000000002', required_qty: 1, critical: true, weight: 1.5 },
      { id: 'r21', project_id: 'p5', component_id: 'c0000012-0000-0000-0000-00000000012', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r22', project_id: 'p5', component_id: 'c0000005-0000-0000-0000-000000000005', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r23', project_id: 'p5', component_id: 'c0000015-0000-0000-0000-000000000015', required_qty: 1, critical: false, weight: 0.5 },
    ]
  },
  {
    id: 'p0000006-0000-0000-0000-000000000006',
    title: 'Touchless Smart Sanitation Dustbin',
    slug: 'smart-dustbin',
    description: 'Hygienic automatic lid opening system using HC-SR04 ultrasonic wave trigger and SG90 servo.',
    difficulty: 'Beginner',
    category: 'Smart Home',
    estimated_reuse_g: 145.0,
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    instructions: 'When hand is detected within 15cm for >0.5s, servo rotates 90 degrees to lift bin lid for 4s.',
    status: 'active',
    requirements: [
      { id: 'r24', project_id: 'p6', component_id: 'c0000002-0000-0000-0000-000000000002', required_qty: 1, critical: true, weight: 1.5 },
      { id: 'r25', project_id: 'p6', component_id: 'c0000003-0000-0000-0000-000000000003', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r26', project_id: 'p6', component_id: 'c0000009-0000-0000-0000-000000000009', required_qty: 1, critical: true, weight: 1.2 },
    ]
  },
  {
    id: 'p0000007-0000-0000-0000-000000000007',
    title: '4-Channel Home Automation Hub',
    slug: 'home-automation-hub',
    description: 'Web-controlled household appliance relay console running lightweight web server on ESP32.',
    difficulty: 'Intermediate',
    category: 'Home Automation',
    estimated_reuse_g: 260.0,
    image_url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    instructions: 'Host asynchronous WebSockets portal on ESP32 to switch loads with real-time feedback.',
    status: 'active',
    requirements: [
      { id: 'r27', project_id: 'p7', component_id: 'c0000001-0000-0000-0000-000000000001', required_qty: 1, critical: true, weight: 1.5 },
      { id: 'r28', project_id: 'p7', component_id: 'c0000005-0000-0000-0000-000000000005', required_qty: 2, critical: true, weight: 1.2 },
      { id: 'r29', project_id: 'p7', component_id: 'c0000015-0000-0000-0000-000000000015', required_qty: 1, critical: false, weight: 0.5 },
    ]
  },
  {
    id: 'p0000008-0000-0000-0000-000000000008',
    title: 'Precision Temperature Monitor & Alarm',
    slug: 'temp-monitor-alarm',
    description: 'Threshold surveillance for server racks or 3D printers, sounding buzzer when overheating.',
    difficulty: 'Beginner',
    category: 'Monitoring',
    estimated_reuse_g: 115.0,
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    instructions: 'Sample temperature every 2 seconds. If exceeds 45C, pulse active buzzer and print warning to LCD.',
    status: 'active',
    requirements: [
      { id: 'r30', project_id: 'p8', component_id: 'c0000002-0000-0000-0000-000000000002', required_qty: 1, critical: true, weight: 1.5 },
      { id: 'r31', project_id: 'p8', component_id: 'c0000010-0000-0000-0000-00000000010', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r32', project_id: 'p8', component_id: 'c0000013-0000-0000-0000-00000000013', required_qty: 1, critical: true, weight: 1.0 },
      { id: 'r33', project_id: 'p8', component_id: 'c0000011-0000-0000-0000-00000000011', required_qty: 1, critical: false, weight: 0.8 },
    ]
  },
  {
    id: 'p0000009-0000-0000-0000-000000000009',
    title: 'High-Speed Line Follower Robot',
    slug: 'line-follower',
    description: 'Dual optical sensor vehicle calibrated to follow dark floor tracks with differential motor drive.',
    difficulty: 'Intermediate',
    category: 'Robotics',
    estimated_reuse_g: 290.0,
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    instructions: 'Calibrate analog threshold for TCRT5000 sensors. Run proportional steering loop on TT motors.',
    status: 'active',
    requirements: [
      { id: 'r34', project_id: 'p9', component_id: 'c0000002-0000-0000-0000-000000000002', required_qty: 1, critical: true, weight: 1.5 },
      { id: 'r35', project_id: 'p9', component_id: 'c0000014-0000-0000-0000-00000000014', required_qty: 2, critical: true, weight: 1.2 },
      { id: 'r36', project_id: 'p9', component_id: 'c0000007-0000-0000-0000-000000000007', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r37', project_id: 'p9', component_id: 'c0000008-0000-0000-0000-000000000008', required_qty: 2, critical: true, weight: 1.0 },
      { id: 'r38', project_id: 'p9', component_id: 'c0000016-0000-0000-0000-000000000016', required_qty: 1, critical: true, weight: 1.0 },
    ]
  },
  {
    id: 'p00000010-0000-0000-0000-0000000010',
    title: 'Intruder Motion Alarm System',
    slug: 'motion-alarm-system',
    description: 'Security tripwire using PIR detection and active buzzer with armed status LED indicator.',
    difficulty: 'Beginner',
    category: 'Security',
    estimated_reuse_g: 125.0,
    image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    instructions: 'Arm system after 10-second countdown. Sound pulsing buzzer pattern upon PIR motion trigger.',
    status: 'active',
    requirements: [
      { id: 'r39', project_id: 'p10', component_id: 'c0000001-0000-0000-0000-000000000001', required_qty: 1, critical: true, weight: 1.5 },
      { id: 'r40', project_id: 'p10', component_id: 'c0000012-0000-0000-0000-00000000012', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r41', project_id: 'p10', component_id: 'c0000013-0000-0000-0000-00000000013', required_qty: 1, critical: true, weight: 1.2 },
    ]
  },
  {
    id: 'p00000011-0000-0000-0000-0000000011',
    title: 'Overhead Water Tank Level Controller',
    slug: 'water-level-controller',
    description: 'Non-contact tank capacity monitor stopping pump motor when upper threshold is reached.',
    difficulty: 'Intermediate',
    category: 'Utilities & IoT',
    estimated_reuse_g: 230.0,
    image_url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=600&q=80',
    instructions: 'Calculate water level percentage from distance measured. Disengage relay when tank reaches 95%.',
    status: 'active',
    requirements: [
      { id: 'r42', project_id: 'p11', component_id: 'c0000002-0000-0000-0000-000000000002', required_qty: 1, critical: true, weight: 1.5 },
      { id: 'r43', project_id: 'p11', component_id: 'c0000003-0000-0000-0000-000000000003', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r44', project_id: 'p11', component_id: 'c0000005-0000-0000-0000-000000000005', required_qty: 1, critical: true, weight: 1.2 },
      { id: 'r45', project_id: 'p11', component_id: 'c0000013-0000-0000-0000-00000000013', required_qty: 1, critical: false, weight: 0.8 },
    ]
  }
];

export const SEED_INVENTORY: UserInventoryItem[] = [
  {
    id: 'u0000001-0000-0000-0000-000000000001',
    user_id: '22222222-2222-2222-2222-222222222222', // Vikram
    component_id: 'c0000001-0000-0000-0000-000000000001', // ESP32
    qty: 1,
    source: 'scanned_board',
  },
  {
    id: 'u0000002-0000-0000-0000-000000000002',
    user_id: '22222222-2222-2222-2222-222222222222',
    component_id: 'c0000004-0000-0000-0000-000000000004', // Soil Sensor
    qty: 1,
    source: 'lab_kit',
  },
  {
    id: 'u0000003-0000-0000-0000-000000000003',
    user_id: '22222222-2222-2222-2222-222222222222',
    component_id: 'c0000005-0000-0000-0000-000000000005', // 5V Relay
    qty: 1,
    source: 'past_project',
  },
  {
    id: 'u0000004-0000-0000-0000-000000000004',
    user_id: '22222222-2222-2222-2222-222222222222',
    component_id: 'c0000015-0000-0000-0000-000000000015', // Breadboard & Wires
    qty: 1,
    source: 'starter_kit',
  },
  {
    id: 'u0000005-0000-0000-0000-000000000005',
    user_id: '22222222-2222-2222-2222-222222222222',
    component_id: 'c0000003-0000-0000-0000-000000000003', // HC-SR04
    qty: 1,
    source: 'salvaged',
  }
];

export const SEED_LISTINGS: Listing[] = [
  {
    id: 'l0000001-0000-0000-0000-000000000001',
    seller_id: '11111111-1111-1111-1111-111111111111',
    component_id: 'c0000006-0000-0000-0000-000000000006',
    title: 'Mini Submersible Water Pump 5V (Never Submerged)',
    description: 'Brand new 5V micro water pump, tested dry with power supply. Perfect for plant watering automation.',
    condition: 'like_new',
    quantity: 4,
    mode: 'sell',
    price: 180.0,
    rent_per_day: 0,
    status: 'active',
    mass_g: 85.0,
    tags: ['pump', 'water', 'smart-irrigation', '5v'],
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'l0000002-0000-0000-0000-000000000002',
    seller_id: '11111111-1111-1111-1111-111111111111',
    component_id: 'c0000002-0000-0000-0000-000000000002',
    title: 'Genuine Arduino Uno R3 with Acrylic Case',
    description: 'Surplus Arduino Uno R3 from college semester workshop. Header pins clean, tested with blink sketch.',
    condition: 'used_functional',
    quantity: 3,
    mode: 'sell',
    price: 350.0,
    rent_per_day: 0,
    status: 'active',
    mass_g: 45.0,
    tags: ['arduino', 'uno', 'microcontroller', 'robotics'],
    image_url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=400&q=80',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'l0000003-0000-0000-0000-000000000003',
    seller_id: '33333333-3333-3333-3333-333333333333',
    component_id: 'c0000007-0000-0000-0000-000000000007',
    title: 'L298N Dual Motor Driver Shields (College Surplus)',
    description: 'Tested dual H-bridge modules. Donating to students building academic rovers or line followers.',
    condition: 'used_functional',
    quantity: 5,
    mode: 'donate',
    price: 0,
    rent_per_day: 0,
    status: 'active',
    mass_g: 40.0,
    tags: ['motor-driver', 'l298n', 'rc-car', 'robotics'],
    image_url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=400&q=80',
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'l0000004-0000-0000-0000-000000000004',
    seller_id: '11111111-1111-1111-1111-111111111111',
    component_id: 'c0000008-0000-0000-0000-000000000008',
    title: 'Pair of TT Gear Motors with Rubber Wheels',
    description: 'Yellow TT motors 1:48 gear ratio with clean tires. Great for two-wheel robots.',
    condition: 'like_new',
    quantity: 6,
    mode: 'sell',
    price: 140.0,
    rent_per_day: 0,
    status: 'active',
    mass_g: 60.0,
    tags: ['tt-motor', 'wheels', 'robotics', 'rc-car'],
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'l0000005-0000-0000-0000-000000000005',
    seller_id: '11111111-1111-1111-1111-111111111111',
    component_id: 'c0000009-0000-0000-0000-000000000009',
    title: 'TowerPro SG90 9g Micro Servo with Horns',
    description: 'Lightweight 9g micro servo motor with 3 servo arms and screws. Smooth rotation tested.',
    condition: 'like_new',
    quantity: 8,
    mode: 'sell',
    price: 110.0,
    rent_per_day: 0,
    status: 'active',
    mass_g: 12.0,
    tags: ['servo', 'sg90', 'dustbin', 'robotics'],
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    created_at: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 'l0000006-0000-0000-0000-000000000006',
    seller_id: '33333333-3333-3333-3333-333333333333',
    component_id: 'c0000010-0000-0000-0000-00000000010',
    title: 'DHT11 Humidity & Temperature Sensors',
    description: 'Surplus calibrated digital sensors for environmental monitoring projects.',
    condition: 'like_new',
    quantity: 10,
    mode: 'sell',
    price: 85.0,
    rent_per_day: 0,
    status: 'active',
    mass_g: 10.0,
    tags: ['sensor', 'dht11', 'weather', 'temperature'],
    image_url: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=400&q=80',
    created_at: new Date(Date.now() - 400000000).toISOString(),
  },
  {
    id: 'l0000007-0000-0000-0000-000000000007',
    seller_id: '11111111-1111-1111-1111-111111111111',
    component_id: 'c0000011-0000-0000-0000-00000000011',
    title: '16x2 I2C Blue Backlight LCD Screen',
    description: 'Pre-soldered PCF8574 backpack with address 0x27. Tested on Arduino and ESP32.',
    condition: 'used_functional',
    quantity: 2,
    mode: 'rent',
    price: 0,
    rent_per_day: 15.0,
    status: 'active',
    mass_g: 40.0,
    tags: ['lcd', 'display', 'i2c', 'weather'],
    image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
    created_at: new Date(Date.now() - 500000000).toISOString(),
  }
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'o0000001-0000-0000-0000-000000000001',
    listing_id: 'l0000001-0000-0000-0000-000000000001',
    buyer_id: '22222222-2222-2222-2222-222222222222',
    seller_id: '11111111-1111-1111-1111-111111111111',
    qty: 1,
    type: 'buy',
    amount: 180.0,
    status: 'ready_for_handover',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    payment_demo: {
      order_id: 'o0000001-0000-0000-0000-000000000001',
      state: 'held_demo',
      amount: 180.0,
      held_at: new Date(Date.now() - 3600000).toISOString(),
    },
    handover: {
      order_id: 'o0000001-0000-0000-0000-000000000001',
      buyer_hash: '7492',
      seller_hash: '5184',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    }
  }
];

export const SEED_IMPACT_EVENTS: ImpactEvent[] = [
  {
    id: 'i0000001-0000-0000-0000-000000000001',
    user_id: '11111111-1111-1111-1111-111111111111',
    source_type: 'order_completion',
    source_id: 'prev-order-1',
    reuse_g: 1250.0,
    recycle_g: 450.0,
    savings_estimate: 3200.0,
    created_at: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: 'i0000002-0000-0000-0000-000000000002',
    user_id: '33333333-3333-3333-3333-333333333333',
    source_type: 'ewaste_recycle',
    source_id: 'prev-ewaste-1',
    reuse_g: 3100.0,
    recycle_g: 2400.0,
    savings_estimate: 8900.0,
    created_at: new Date(Date.now() - 1209600000).toISOString(),
  }
];

export const SEED_EWASTE: EWasteSubmission[] = [
  {
    id: 'e0000001-0000-0000-0000-000000000001',
    user_id: '22222222-2222-2222-2222-222222222222',
    category: 'Printed Circuit Boards (PCBs)',
    weight_g: 850.0,
    route: 'recycling_partner_demo',
    estimated_value: 120.0,
    status: 'scheduled_pickup',
    notes: 'Damaged power supply boards and unrepairable CRT monitor chassis.',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  }
];

// Persistent State Handler (Browser localStorage or Node memory)
class MemoryDataStore {
  private profiles = [...SEED_PROFILES];
  private catalog = [...SEED_CATALOG];
  private projects = [...SEED_PROJECTS];
  private inventory = [...SEED_INVENTORY];
  private listings = [...SEED_LISTINGS];
  private orders = [...SEED_ORDERS];
  private impactEvents = [...SEED_IMPACT_EVENTS];
  private ewaste = [...SEED_EWASTE];
  private activeUserId = '22222222-2222-2222-2222-222222222222'; // Default: Vikram Patel (Buyer/Student)

  getActiveUser(): Profile {
    return this.profiles.find(p => p.id === this.activeUserId) || this.profiles[1];
  }

  setActiveUser(userId: string) {
    const found = this.profiles.find(p => p.id === userId);
    if (found) {
      this.activeUserId = userId;
    }
  }

  getProfiles(): Profile[] {
    return [...this.profiles];
  }

  getCatalog(): ComponentCatalogItem[] {
    return [...this.catalog];
  }

  getProjects(): Project[] {
    return [...this.projects];
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id || p.slug === id);
  }

  getUserInventory(userId?: string): UserInventoryItem[] {
    const uid = userId || this.activeUserId;
    return this.inventory.filter(i => i.user_id === uid);
  }

  addInventoryItem(item: Omit<UserInventoryItem, 'id'>): UserInventoryItem {
    const newItem: UserInventoryItem = {
      ...item,
      id: `u-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    this.inventory.push(newItem);
    return newItem;
  }

  getListings(): Listing[] {
    return [...this.listings].map(l => ({
      ...l,
      seller: this.profiles.find(p => p.id === l.seller_id),
      component: this.catalog.find(c => c.id === l.component_id),
    }));
  }

  getListingById(id: string): Listing | undefined {
    const l = this.listings.find(item => item.id === id);
    if (!l) return undefined;
    return {
      ...l,
      seller: this.profiles.find(p => p.id === l.seller_id),
      component: this.catalog.find(c => c.id === l.component_id),
    };
  }

  createListing(listingData: Omit<Listing, 'id' | 'created_at' | 'status'>): Listing {
    const newListing: Listing = {
      ...listingData,
      id: `l-${Date.now()}`,
      status: 'active',
      created_at: new Date().toISOString(),
    };
    this.listings.unshift(newListing);

    // Also add to seller inventory
    if (listingData.component_id) {
      this.inventory.push({
        id: `u-list-${Date.now()}`,
        user_id: listingData.seller_id,
        component_id: listingData.component_id,
        qty: listingData.quantity,
        source: 'created_listing',
        listing_id: newListing.id,
      });
    }

    return newListing;
  }

  getOrders(userId?: string): Order[] {
    const uid = userId || this.activeUserId;
    return this.orders
      .filter(o => o.buyer_id === uid || o.seller_id === uid)
      .map(o => ({
        ...o,
        listing: this.getListingById(o.listing_id),
        buyer: this.profiles.find(p => p.id === o.buyer_id),
        seller: this.profiles.find(p => p.id === o.seller_id),
      }));
  }

  getOrderById(orderId: string): Order | undefined {
    const o = this.orders.find(item => item.id === orderId);
    if (!o) return undefined;
    return {
      ...o,
      listing: this.getListingById(o.listing_id),
      buyer: this.profiles.find(p => p.id === o.buyer_id),
      seller: this.profiles.find(p => p.id === o.seller_id),
    };
  }

  createOrder(params: {
    listing_id: string;
    buyer_id: string;
    qty: number;
    type: 'buy' | 'rent' | 'donate';
  }): Order {
    const listing = this.listings.find(l => l.id === params.listing_id);
    if (!listing) throw new Error('Listing not found');
    if (listing.quantity < params.qty) throw new Error('Insufficient stock remaining');

    const totalAmount = listing.mode === 'sell' ? listing.price * params.qty : (listing.mode === 'rent' ? listing.rent_per_day * params.qty : 0);
    const orderId = `o-${Date.now()}`;

    // Generate 4-digit codes for handover
    const buyerCode = Math.floor(1000 + Math.random() * 9000).toString();
    const sellerCode = Math.floor(1000 + Math.random() * 9000).toString();

    const order: Order = {
      id: orderId,
      listing_id: params.listing_id,
      buyer_id: params.buyer_id,
      seller_id: listing.seller_id,
      qty: params.qty,
      type: params.type,
      amount: totalAmount,
      status: 'ready_for_handover',
      created_at: new Date().toISOString(),
      payment_demo: {
        order_id: orderId,
        state: 'held_demo',
        amount: totalAmount,
        held_at: new Date().toISOString(),
      },
      handover: {
        order_id: orderId,
        buyer_hash: buyerCode,
        seller_hash: sellerCode,
        expires_at: new Date(Date.now() + 86400000).toISOString(),
      }
    };

    this.orders.unshift(order);
    return order;
  }

  confirmHandover(params: {
    order_id: string;
    code: string;
    role: 'buyer' | 'seller';
  }): { success: boolean; message: string; order: Order } {
    const order = this.orders.find(o => o.id === params.order_id);
    if (!order || !order.handover) {
      throw new Error('Order or handover session not found');
    }

    if (order.status === 'completed') {
      return { success: true, message: 'Order already completed', order };
    }

    if (params.role === 'buyer') {
      if (order.handover.buyer_hash !== params.code) {
        throw new Error('Invalid buyer verification code');
      }
      order.handover.buyer_verified_at = new Date().toISOString();
    } else {
      if (order.handover.seller_hash !== params.code) {
        throw new Error('Invalid seller verification code');
      }
      order.handover.seller_verified_at = new Date().toISOString();
    }

    // Check if both confirmed (or for quick demo testing, single confirmed completes)
    const isBothConfirmed = !!(order.handover.buyer_verified_at && order.handover.seller_verified_at);

    if (isBothConfirmed) {
      // Complete transaction atomically
      order.status = 'completed';
      if (order.payment_demo) {
        order.payment_demo.state = 'released_demo';
        order.payment_demo.released_at = new Date().toISOString();
      }

      // Decrement listing quantity
      const listing = this.listings.find(l => l.id === order.listing_id);
      if (listing) {
        listing.quantity = Math.max(0, listing.quantity - order.qty);
        if (listing.quantity === 0) {
          listing.status = 'sold_out';
        }
        // Add impact event
        const reusedGrams = listing.mass_g * order.qty;
        this.impactEvents.push({
          id: `imp-${Date.now()}`,
          user_id: order.buyer_id,
          source_type: 'order_completion',
          source_id: order.id,
          reuse_g: reusedGrams,
          recycle_g: 0,
          savings_estimate: order.amount,
          created_at: new Date().toISOString(),
        });

        // Add to buyer's user inventory
        if (listing.component_id) {
          const existingInv = this.inventory.find(
            i => i.user_id === order.buyer_id && i.component_id === listing.component_id
          );
          if (existingInv) {
            existingInv.qty += order.qty;
          } else {
            this.inventory.push({
              id: `u-bought-${Date.now()}`,
              user_id: order.buyer_id,
              component_id: listing.component_id,
              qty: order.qty,
              source: 'recircuit_marketplace',
            });
          }
        }
      }
    }

    return {
      success: true,
      message: isBothConfirmed ? 'Handover completed! Stock updated and impact logged.' : 'Code verified! Waiting for other party confirmation.',
      order,
    };
  }

  getImpactEvents(): ImpactEvent[] {
    return [...this.impactEvents];
  }

  submitEWaste(submission: Omit<EWasteSubmission, 'id' | 'created_at' | 'status'>): EWasteSubmission {
    const item: EWasteSubmission = {
      ...submission,
      id: `e-${Date.now()}`,
      status: 'submitted',
      created_at: new Date().toISOString(),
    };
    this.ewaste.unshift(item);

    // Record recycle impact
    this.impactEvents.push({
      id: `imp-ewaste-${Date.now()}`,
      user_id: submission.user_id,
      source_type: 'ewaste_recycle',
      source_id: item.id,
      reuse_g: 0,
      recycle_g: submission.weight_g,
      savings_estimate: submission.estimated_value,
      created_at: new Date().toISOString(),
    });

    return item;
  }

  getEWasteSubmissions(userId?: string): EWasteSubmission[] {
    const uid = userId || this.activeUserId;
    return this.ewaste.filter(e => e.user_id === uid);
  }
}

// Global Singleton Store
const globalDataStore = new MemoryDataStore();
export function getDataStore(): MemoryDataStore {
  return globalDataStore;
}
