-- ReCircuit Application Knowledge Base Seed Data
-- Curated technical knowledge for Grounded Lexical RAG Assistant

INSERT INTO application_knowledge (title, content, category)
VALUES
(
    'Safe Electrical Testing of Salvaged Electronics',
    'Before connecting salvaged components to a live project or battery: 1. Perform a visual inspection for charred silicon, bent IC pins, or delaminated PCB traces. 2. Measure resistance between VCC and GND with a digital multimeter in continuity mode to ensure no short circuits exist. 3. Power up using a current-limited DC bench supply at the rated voltage (typically 3.3V for ESP32/micro-sensors or 5.0V for Arduino logic).',
    'Safety'
),
(
    'Dual-Confirmation Handover Protocol',
    'To guarantee integrity and eliminate fraud in circular hardware transfers, ReCircuit mandates dual confirmation: Both the buyer/receiver and the seller/donor must confirm the exchange in their respective order dashboards. Upon both confirmations, the simulated escrow payment is finalized, the listing stock is atomically decremented, and the empirical physical mass (in grams) is credited to the environmental impact ledger.',
    'Operations'
),
(
    'Smart Plant Irrigation System BOM',
    'The Smart Plant Irrigation System requires 5 core components: 1. Microcontroller (ESP32 DevKit or Arduino Uno), 2. Capacitive Soil Moisture Sensor v1.2, 3. 5V Single Channel Optocoupler Relay Module, 4. Mini Submersible 5V DC Water Pump, and 5. Solderless Breadboard with jumper wires. Total estimated diverted mass is ~280 grams.',
    'Projects'
),
(
    'Autonomous Obstacle Avoiding Rover BOM',
    'The Obstacle Avoiding Robot requires 6 core components: 1. Arduino Uno R3 or ESP32, 2. HC-SR04 Ultrasonic Rangefinder Sensor, 3. L298N Dual H-Bridge Motor Driver Module, 4. TT Dual Shaft DC Gear Motors (2 units) with 65mm rubber wheels, 5. SG90 Micro 9g Servo Motor for sensor panning, and 6. 2S 18650 Battery Pack Holder with BMS. Total estimated diverted mass is ~390 grams.',
    'Projects'
),
(
    'Certified E-Waste Recycling Standards',
    'Hardware that is unrepairable, missing silicon silicon dies, or experiencing burnt traces should not enter the circular component reuse stream. Instead, route such items through ReCircuit E-Waste Intake to R2 (Responsible Recycling) or e-Stewards certified recyclers. Items under 500 grams should be batched to minimize transportation carbon overhead.',
    'Sustainability'
);
