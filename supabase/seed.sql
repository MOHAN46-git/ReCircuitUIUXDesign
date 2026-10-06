-- ReCircuit Comprehensive Seed Data
-- 3 Demo Profiles, 16 Component Catalog Items, 11 Projects with Complete BOMs, 15+ Active Listings, User Inventories

-- 1. Demo Profiles
INSERT INTO profiles (id, role, first_name, last_name, email, avatar_url, phone, organization, verification_status)
VALUES
('11111111-1111-1111-1111-111111111111', 'seller', 'Priya', 'Sharma', 'priya.maker@recircuit.org', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80', '+91 98765 43210', 'GreenCircuit Makerspace', 'verified'),
('22222222-2222-2222-2222-222222222222', 'buyer', 'Vikram', 'Patel', 'vikram.student@saveetha.ac.in', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80', '+91 98765 12345', 'Saveetha School of Engineering', 'demo_verified'),
('33333333-3333-3333-3333-333333333333', 'institution', 'Dr. Ramesh', 'Sundaram', 'ramesh.lab@recircuit.org', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80', '+91 94440 98765', 'IoT & Robotics Circular Lab', 'verified')
ON CONFLICT (id) DO NOTHING;

-- 2. Component Catalog
INSERT INTO component_catalog (id, canonical_name, aliases, category, description, default_mass_g)
VALUES
('c0000001-0000-0000-0000-000000000001', 'ESP32 DevKit V1', ARRAY['esp32', 'esp-32', 'esp wroom 32', 'nodemcu 32'], 'Microcontrollers', 'Dual-core 32-bit MCU with built-in Wi-Fi and Bluetooth BLE.', 35.0),
('c0000002-0000-0000-0000-000000000002', 'Arduino Uno R3', ARRAY['arduino uno', 'uno r3', 'atmega328p board', 'uno'], 'Microcontrollers', 'ATmega328P based microcontroller board with 14 digital I/O pins.', 45.0),
('c0000003-0000-0000-0000-000000000003', 'Ultrasonic Sensor HC-SR04', ARRAY['hc-sr04', 'ultrasonic sensor', 'hcsr04', 'distance sensor'], 'Sensors', '2cm to 400cm non-contact distance measurement module.', 15.0),
('c0000004-0000-0000-0000-000000000004', 'Soil Moisture Sensor Capacitive', ARRAY['soil sensor', 'soil moisture', 'capacitive soil sensor', 'hygrometer'], 'Sensors', 'Analog/digital soil moisture sensing probe for irrigation.', 20.0),
('c0000005-0000-0000-0000-000000000005', '5V Single Channel Relay Module', ARRAY['relay', '5v relay', '1-channel relay', 'relay module'], 'Actuators', 'Optocoupler isolated relay switch for AC/DC load control up to 10A.', 25.0),
('c0000006-0000-0000-0000-000000000006', 'Mini Submersible Water Pump 5V', ARRAY['mini pump', 'water pump', '5v pump', 'dc water pump'], 'Actuators', 'Compact low-noise DC submersible pump for automated watering.', 85.0),
('c0000007-0000-0000-0000-000000000007', 'L298N Dual H-Bridge Motor Driver', ARRAY['l298n', 'motor driver', 'dual h-bridge', 'dc motor driver'], 'Drivers', 'High-power motor driver module for dual DC motors or stepper.', 40.0),
('c0000008-0000-0000-0000-000000000008', 'TT Dual Shaft Gear Motor 3-6V', ARRAY['tt motor', 'gear motor', 'bo motor', 'dc gear motor'], 'Actuators', 'Yellow reduction gearbox DC motor with high torque for robotics.', 30.0),
('c0000009-0000-0000-0000-000000000009', 'Servo Motor SG90 Micro 9g', ARRAY['sg90', 'servo', 'micro servo', '9g servo'], 'Actuators', '180 degree rotation micro servo motor with horns and gears.', 12.0),
('c0000010-0000-0000-0000-00000000010', 'DHT11 Temperature & Humidity Sensor', ARRAY['dht11', 'dht-11', 'temp sensor', 'humidity sensor'], 'Sensors', 'Calibrated digital signal output temperature and humidity sensor.', 10.0),
('c0000011-0000-0000-0000-00000000011', '16x2 I2C Character LCD Display', ARRAY['1602 lcd', 'i2c lcd', '16x2 lcd', 'character display'], 'Displays', 'HD44780 standard 16x2 blue backlight display with PCF8574 I2C adapter.', 40.0),
('c0000012-0000-0000-0000-00000000012', 'PIR Motion Sensor HC-SR501', ARRAY['pir sensor', 'hc-sr501', 'motion sensor', 'pyroelectric sensor'], 'Sensors', 'Passive infrared sensor detecting human or obstacle body movement.', 18.0),
('c0000013-0000-0000-0000-00000000013', 'Active Buzzer Module 5V', ARRAY['buzzer', 'active buzzer', 'alarm buzzer', 'piezo buzzer'], 'Indicators', 'Continuous audio tone transducer with internal oscillation.', 6.0),
('c0000014-0000-0000-0000-00000000014', 'TCRT5000 Infrared Line Tracking Sensor', ARRAY['tcrt5000', 'line sensor', 'ir tracking sensor', 'line follower sensor'], 'Sensors', 'Phototransistor reflective optical sensor for path detection.', 12.0),
('c0000015-0000-0000-0000-00000000015', 'Breadboard 830 Points & Jumper Pack', ARRAY['breadboard', 'jumper wires', 'prototyping board', 'wires pack'], 'Prototyping', 'Standard solderless breadboard with 65-piece male-to-male jumper wires.', 95.0),
('c0000016-0000-0000-0000-00000000016', 'Lithium 18650 Battery Holder & BMS 2S', ARRAY['18650 holder', 'battery pack', '2s bms', 'battery shield'], 'Power', 'Dual cell 18650 battery holder with integrated 7.4V protection circuit.', 55.0)
ON CONFLICT (id) DO NOTHING;

-- 3. Predefined Projects (11 Projects)
INSERT INTO projects (id, title, slug, description, difficulty, category, estimated_reuse_g, image_url, instructions)
VALUES
('p0000001-0000-0000-0000-000000000001', 'Smart Plant Irrigation System', 'smart-irrigation', 'Automated moisture-sensing drip irrigation controller with relay and submersible pump.', 'Beginner', 'Agriculture & IoT', 280.0, 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80', 'Wire soil sensor to ESP32 ADC pin, connect relay IN to GPIO4, trigger pump when moisture drops below 30%.'),

('p0000002-0000-0000-0000-000000000002', 'Autonomous Obstacle Avoiding Robot', 'obstacle-robot', 'Two-wheel rover using HC-SR04 ultrasonic rangefinder and L298N driver to navigate rooms safely.', 'Intermediate', 'Robotics', 390.0, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80', 'Mount ultrasonic sensor on SG90 servo. Sweep 45-135 degrees. Reverse when distance < 15cm.'),

('p0000003-0000-0000-0000-000000000003', 'Bluetooth RC Rover / Car', 'rc-car-rover', 'Remote controlled motorized chassis driven wirelessly via smartphone Bluetooth through ESP32.', 'Beginner', 'Robotics', 320.0, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', 'Pair Android Bluetooth Serial Controller with ESP32 BT Classic. Translate directional commands to L298N outputs.'),

('p0000004-0000-0000-0000-000000000004', 'IoT Weather Monitoring Station', 'weather-monitor', 'Live temperature, humidity, and cloud metrics display with I2C 16x2 LCD and Wi-Fi sync.', 'Beginner', 'IoT & Sensors', 185.0, 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=600&q=80', 'Read DHT11 sensor periodically, format strings, push to Adafruit IO and update local I2C LCD.'),

('p0000005-0000-0000-0000-000000000005', 'Automatic Smart Night Lamp', 'smart-night-lamp', 'Energy-saving light controller activated by human presence and low ambient illumination.', 'Beginner', 'Home Automation', 170.0, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80', 'PIR sensor triggers relay switch for LED lamp for 60 seconds upon detecting motion in darkness.'),

('p0000006-0000-0000-0000-000000000006', 'Touchless Smart Sanitation Dustbin', 'smart-dustbin', 'Hygienic automatic lid opening system using HC-SR04 ultrasonic wave trigger and SG90 servo.', 'Beginner', 'Smart Home', 145.0, 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80', 'When hand is detected within 15cm for >0.5s, servo rotates 90 degrees to lift bin lid for 4s.'),

('p0000007-0000-0000-0000-000000000007', '4-Channel Home Automation Hub', 'home-automation-hub', 'Web-controlled household appliance relay console running lightweight web server on ESP32.', 'Intermediate', 'Home Automation', 260.0, 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', 'Host asynchronous WebSockets portal on ESP32 to switch loads with real-time feedback and state memory.'),

('p0000008-0000-0000-0000-000000000008', 'Precision Temperature Monitor & Alarm', 'temp-monitor-alarm', 'Threshold surveillance for server racks or 3D printers, sounding buzzer when overheating.', 'Beginner', 'Monitoring', 115.0, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', 'Sample temperature every 2 seconds. If exceeds 45C, pulse active buzzer and print warning to LCD.'),

('p0000009-0000-0000-0000-000000000009', 'High-Speed Line Follower Robot', 'line-follower', 'Dual optical sensor vehicle calibrated to follow dark floor tracks with differential motor drive.', 'Intermediate', 'Robotics', 290.0, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', 'Calibrate analog threshold for TCRT5000 sensors. Run proportional steering loop on TT motors.'),

('p00000010-0000-0000-0000-0000000010', 'Intruder Motion Alarm System', 'motion-alarm-system', 'Security tripwire using PIR detection and active buzzer with armed status LED indicator.', 'Beginner', 'Security', 125.0, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', 'Arm system after 10-second countdown. Sound pulsing buzzer pattern upon PIR motion trigger.'),

('p00000011-0000-0000-0000-0000000011', 'Overhead Water Tank Level Controller', 'water-level-controller', 'Non-contact tank capacity monitor stopping pump motor when upper threshold is reached.', 'Intermediate', 'Utilities & IoT', 230.0, 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=600&q=80', 'Calculate water level percentage from distance measured. Disengage relay when tank reaches 95%.')
ON CONFLICT (id) DO NOTHING;

-- 4. Project Requirements (BOM Definitions)
-- Smart Irrigation: ESP32 (1), Soil Sensor (1), 5V Relay (1), Water Pump (1), Breadboard/Wires (1)
INSERT INTO project_requirements (project_id, component_id, required_qty, critical, weight) VALUES
('p0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 1, true, 1.5),
('p0000001-0000-0000-0000-000000000001', 'c0000004-0000-0000-0000-000000000004', 1, true, 1.2),
('p0000001-0000-0000-0000-000000000001', 'c0000005-0000-0000-0000-000000000005', 1, true, 1.0),
('p0000001-0000-0000-0000-000000000001', 'c0000006-0000-0000-0000-000000000006', 1, true, 1.2),
('p0000001-0000-0000-0000-000000000001', 'c0000015-0000-0000-0000-000000000015', 1, false, 0.5),

-- Obstacle Robot: Arduino Uno (1), HC-SR04 (1), L298N (1), TT Motors (2), SG90 Servo (1), 18650 Pack (1)
('p0000002-0000-0000-0000-000000000002', 'c0000002-0000-0000-0000-000000000002', 1, true, 1.5),
('p0000002-0000-0000-0000-000000000002', 'c0000003-0000-0000-0000-000000000003', 1, true, 1.2),
('p0000002-0000-0000-0000-000000000002', 'c0000007-0000-0000-0000-000000000007', 1, true, 1.2),
('p0000002-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000008', 2, true, 1.0),
('p0000002-0000-0000-0000-000000000002', 'c0000009-0000-0000-0000-000000000009', 1, false, 0.8),
('p0000002-0000-0000-0000-000000000002', 'c0000016-0000-0000-0000-000000000016', 1, true, 1.0),

-- RC Rover: ESP32 (1), L298N (1), TT Motors (2), 18650 Pack (1)
('p0000003-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000001', 1, true, 1.5),
('p0000003-0000-0000-0000-000000000003', 'c0000007-0000-0000-0000-000000000007', 1, true, 1.2),
('p0000003-0000-0000-0000-000000000003', 'c0000008-0000-0000-0000-000000000008', 2, true, 1.0),
('p0000003-0000-0000-0000-000000000003', 'c0000016-0000-0000-0000-000000000016', 1, true, 1.0),

-- Weather Station: ESP32 (1), DHT11 (1), 16x2 LCD (1), Breadboard/Wires (1)
('p0000004-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000001', 1, true, 1.5),
('p0000004-0000-0000-0000-000000000004', 'c0000010-0000-0000-0000-000000000010', 1, true, 1.2),
('p0000004-0000-0000-0000-000000000004', 'c0000011-0000-0000-0000-000000000011', 1, true, 1.2),
('p0000004-0000-0000-0000-000000000004', 'c0000015-0000-0000-0000-000000000015', 1, false, 0.5),

-- Smart Night Lamp: Arduino Uno (1), PIR Sensor (1), 5V Relay (1), Breadboard/Wires (1)
('p0000005-0000-0000-0000-000000000005', 'c0000002-0000-0000-0000-000000000002', 1, true, 1.5),
('p0000005-0000-0000-0000-000000000005', 'c0000012-0000-0000-0000-000000000012', 1, true, 1.2),
('p0000005-0000-0000-0000-000000000005', 'c0000005-0000-0000-0000-000000000005', 1, true, 1.2),
('p0000005-0000-0000-0000-000000000005', 'c0000015-0000-0000-0000-000000000015', 1, false, 0.5),

-- Touchless Dustbin: Arduino Uno (1), HC-SR04 (1), SG90 Servo (1)
('p0000006-0000-0000-0000-000000000006', 'c0000002-0000-0000-0000-000000000002', 1, true, 1.5),
('p0000006-0000-0000-0000-000000000006', 'c0000003-0000-0000-0000-000000000003', 1, true, 1.2),
('p0000006-0000-0000-0000-000000000006', 'c0000009-0000-0000-0000-000000000009', 1, true, 1.2),

-- Home Automation Hub: ESP32 (1), 5V Relay (2), Breadboard/Wires (1)
('p0000007-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000001', 1, true, 1.5),
('p0000007-0000-0000-0000-000000000007', 'c0000005-0000-0000-0000-000000000005', 2, true, 1.2),
('p0000007-0000-0000-0000-000000000007', 'c0000015-0000-0000-0000-000000000015', 1, false, 0.5),

-- Temperature Alarm: Arduino Uno (1), DHT11 (1), Active Buzzer (1), 16x2 LCD (1)
('p0000008-0000-0000-0000-000000000008', 'c0000002-0000-0000-0000-000000000002', 1, true, 1.5),
('p0000008-0000-0000-0000-000000000008', 'c0000010-0000-0000-0000-000000000010', 1, true, 1.2),
('p0000008-0000-0000-0000-000000000008', 'c0000013-0000-0000-0000-000000000013', 1, true, 1.0),
('p0000008-0000-0000-0000-000000000008', 'c0000011-0000-0000-0000-000000000011', 1, false, 0.8),

-- Line Follower: Arduino Uno (1), TCRT5000 Line Sensor (2), L298N (1), TT Motors (2), 18650 Pack (1)
('p0000009-0000-0000-0000-000000000009', 'c0000002-0000-0000-0000-000000000002', 1, true, 1.5),
('p0000009-0000-0000-0000-000000000009', 'c0000014-0000-0000-0000-000000000014', 2, true, 1.2),
('p0000009-0000-0000-0000-000000000009', 'c0000007-0000-0000-0000-000000000007', 1, true, 1.2),
('p0000009-0000-0000-0000-000000000009', 'c0000008-0000-0000-0000-000000000008', 2, true, 1.0),
('p0000009-0000-0000-0000-000000000009', 'c0000016-0000-0000-0000-000000000016', 1, true, 1.0),

-- Motion Alarm: ESP32 (1), PIR Sensor (1), Active Buzzer (1)
('p00000010-0000-0000-0000-0000000010', 'c0000001-0000-0000-0000-000000000001', 1, true, 1.5),
('p00000010-0000-0000-0000-0000000010', 'c0000012-0000-0000-0000-000000000012', 1, true, 1.2),
('p00000010-0000-0000-0000-0000000010', 'c0000013-0000-0000-0000-000000000013', 1, true, 1.2),

-- Water Tank Level: Arduino Uno (1), HC-SR04 (1), 5V Relay (1), Active Buzzer (1)
('p00000011-0000-0000-0000-0000000011', 'c0000002-0000-0000-0000-000000000002', 1, true, 1.5),
('p00000011-0000-0000-0000-0000000011', 'c0000003-0000-0000-0000-000000000003', 1, true, 1.2),
('p00000011-0000-0000-0000-0000000011', 'c0000005-0000-0000-0000-000000000005', 1, true, 1.2),
('p00000011-0000-0000-0000-0000000011', 'c0000013-0000-0000-0000-000000000013', 1, false, 0.8)
ON CONFLICT (project_id, component_id) DO NOTHING;

-- 5. User Inventory for Demo Buyer Vikram (has parts to build smart irrigation and touchless dustbin partially!)
INSERT INTO user_inventory (id, user_id, component_id, qty, source)
VALUES
('u0000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'c0000001-0000-0000-0000-000000000001', 1, 'scanned_board'), -- ESP32
('u0000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'c0000004-0000-0000-0000-000000000004', 1, 'lab_kit'),       -- Soil Sensor
('u0000003-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'c0000005-0000-0000-0000-000000000005', 1, 'past_project'),  -- 5V Relay
('u0000004-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'c0000015-0000-0000-0000-000000000015', 1, 'starter_kit'),   -- Breadboard & Wires
('u0000005-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'c0000003-0000-0000-0000-000000000003', 1, 'salvaged')       -- Ultrasonic HC-SR04
ON CONFLICT (user_id, component_id) DO NOTHING;

-- 6. Active Listings (15+ Items) by Seller Priya & Lab Coordinator Ramesh
INSERT INTO listings (id, seller_id, component_id, title, description, condition, quantity, mode, price, rent_per_day, status, mass_g, tags)
VALUES
('l0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'c0000006-0000-0000-0000-000000000006', 'Mini Submersible Water Pump 5V (Never Submerged)', 'Brand new 5V micro water pump, tested dry with power supply. Perfect for plant watering automation.', 'like_new', 4, 'sell', 180.0, 0.0, 'active', 85.0, ARRAY['pump', 'water', 'smart-irrigation', '5v']),

('l0000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'c0000002-0000-0000-0000-000000000002', 'Genuine Arduino Uno R3 with Acrylic Case', 'Surplus Arduino Uno R3 from college semester workshop. Header pins clean, tested with blink sketch.', 'used_functional', 3, 'sell', 350.0, 0.0, 'active', 45.0, ARRAY['arduino', 'uno', 'microcontroller', 'robotics']),

('l0000003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'c0000007-0000-0000-0000-000000000007', 'L298N Dual Motor Driver Shields (College Surplus)', 'Tested dual H-bridge modules. Donating to students building academic rovers or line followers.', 'used_functional', 5, 'donate', 0.0, 0.0, 'active', 40.0, ARRAY['motor-driver', 'l298n', 'rc-car', 'robotics']),

('l0000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'c0000008-0000-0000-0000-000000000008', 'Pair of TT Gear Motors with Rubber Wheels', 'Yellow TT motors 1:48 gear ratio with clean tires. Great for two-wheel robots.', 'like_new', 6, 'sell', 140.0, 0.0, 'active', 60.0, ARRAY['tt-motor', 'wheels', 'robotics', 'rc-car']),

('l0000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'c0000009-0000-0000-0000-000000000009', 'TowerPro SG90 9g Micro Servo with Horns', 'Lightweight 9g micro servo motor with 3 servo arms and screws. Smooth rotation tested.', 'like_new', 8, 'sell', 110.0, 0.0, 'active', 12.0, ARRAY['servo', 'sg90', 'dustbin', 'robotics']),

('l0000006-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', 'c0000010-0000-0000-0000-00000000010', 'DHT11 Humidity & Temperature Sensors', 'Surplus calibrated digital sensors for environmental monitoring projects.', 'like_new', 10, 'sell', 85.0, 0.0, 'active', 10.0, ARRAY['sensor', 'dht11', 'weather', 'temperature']),

('l0000007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'c0000011-0000-0000-0000-00000000011', '16x2 I2C Blue Backlight LCD Screen', 'Pre-soldered PCF8574 backpack with address 0x27. Tested on Arduino and ESP32.', 'used_functional', 2, 'rent', 0.0, 15.0, 'active', 40.0, ARRAY['lcd', 'display', 'i2c', 'weather']),

('l0000008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'c0000012-0000-0000-0000-00000000012', 'HC-SR501 PIR Motion Detector Modules', 'Infrared motion sensor with adjustable sensitivity and delay potentiometers.', 'like_new', 4, 'sell', 95.0, 0.0, 'active', 18.0, ARRAY['pir', 'motion', 'security', 'night-lamp']),

('l0000009-0000-0000-0000-000000000009', '33333333-3333-3333-3333-333333333333', 'c0000013-0000-0000-0000-00000000013', '5V Active Buzzer Modules (Audible Tone)', 'Loud 85dB active sounders for alarms and alert signals.', 'new', 12, 'sell', 35.0, 0.0, 'active', 6.0, ARRAY['buzzer', 'audio', 'alarm', 'security']),

('l0000010-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'c0000014-0000-0000-0000-00000000014', 'Dual TCRT5000 IR Line Hunting Sensor Set', 'High accuracy infrared reflectivity tracker for black line following tracks.', 'used_functional', 4, 'donate', 0.0, 0.0, 'active', 24.0, ARRAY['line-follower', 'ir', 'tcrt5000', 'robotics']),

('l0000011-0000-0000-0000-000000000011', '33333333-3333-3333-3333-333333333333', 'c0000016-0000-0000-0000-00000000016', '2S 18650 Battery Shield with Protection', 'Rechargeable mobile power shield for rovers and field telemetry nodes.', 'like_new', 3, 'rent', 0.0, 20.0, 'active', 55.0, ARRAY['battery', 'power', 'rover', '18650']),

('l0000012-0000-0000-0000-000000000012', '11111111-1111-1111-1111-111111111111', 'c0000001-0000-0000-0000-000000000001', 'ESP32 NodeMCU Wi-Fi + BLE Dev Module', 'CH340 USB driver version. Good condition, tested with MicroPython and Arduino core.', 'used_functional', 2, 'sell', 280.0, 0.0, 'active', 35.0, ARRAY['esp32', 'wifi', 'iot', 'bluetooth']),

('l0000013-0000-0000-0000-000000000013', '11111111-1111-1111-1111-111111111111', 'c0000003-0000-0000-0000-000000000003', 'HC-SR04 Ultrasonic Range Module', 'Classic sonic ping module, works from 5V rail. Tested on breadboard.', 'used_functional', 5, 'sell', 80.0, 0.0, 'active', 15.0, ARRAY['ultrasonic', 'hcsr04', 'distance', 'radar']),

('l0000014-0000-0000-0000-000000000014', '33333333-3333-3333-3333-333333333333', 'c0000005-0000-0000-0000-000000000005', 'Songle 5V Relay Board with Optical Isolation', 'Reliable relay module switching up to 250VAC. High/low trigger selectable.', 'like_new', 6, 'sell', 70.0, 0.0, 'active', 25.0, ARRAY['relay', 'switch', 'iot', 'automation']),

('l0000015-0000-0000-0000-000000000015', '11111111-1111-1111-1111-111111111111', 'c0000015-0000-0000-0000-000000000015', 'Full Size 830-Point Solderless Breadboard', 'Clean white breadboard with power rails plus assorted 20cm jumper wires.', 'like_new', 4, 'donate', 0.0, 0.0, 'active', 95.0, ARRAY['breadboard', 'prototyping', 'diy', 'maker'])
ON CONFLICT (id) DO NOTHING;

-- 7. Initial Seed Order & Handover Record (Demo State)
INSERT INTO orders (id, listing_id, buyer_id, seller_id, qty, type, amount, status)
VALUES
('o0000001-0000-0000-0000-000000000001', 'l0000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 1, 'buy', 180.0, 'ready_for_handover')
ON CONFLICT (id) DO NOTHING;

INSERT INTO payment_demo (order_id, state, amount, held_at)
VALUES
('o0000001-0000-0000-0000-000000000001', 'held_demo', 180.0, NOW() - INTERVAL '1 hour')
ON CONFLICT (order_id) DO NOTHING;

INSERT INTO handover_verifications (order_id, buyer_hash, seller_hash, expires_at)
VALUES
('o0000001-0000-0000-0000-000000000001', '7492', '5184', NOW() + INTERVAL '24 hours')
ON CONFLICT (order_id) DO NOTHING;

-- 8. Existing Cumulative Impact Events
INSERT INTO impact_events (id, user_id, source_type, source_id, reuse_g, recycle_g, savings_estimate)
VALUES
('i0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'order_completion', NULL, 1250.0, 450.0, 3200.0),
('i0000002-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'ewaste_recycle', NULL, 3100.0, 2400.0, 8900.0)
ON CONFLICT (id) DO NOTHING;
