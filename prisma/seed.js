require('dotenv').config();
const prisma = require('../src/config/db');
const { WorkerRole, MachineStatus } = require('@prisma/client');

async function main() {
    console.log('Seeding database...');

    // Clear existing data in FK-safe order
    await prisma.schedule_Logs.deleteMany();
    await prisma.maintenance_Log.deleteMany();
    await prisma.auctions.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.maintenance_Workers.deleteMany();
    await prisma.machines.deleteMany();
    await prisma.students.deleteMany();
    await prisma.trades.deleteMany();
    await prisma.iTI_Workers.deleteMany();
    await prisma.iTI.deleteMany();

    // 1) ITIs (10)
    await prisma.iTI.createMany({
        data: [
            {
                Name: 'Government ITI Mumbai',
                City: 'Mumbai',
                State: 'Maharashtra',
                Address: 'Sector 12, Vashi, Navi Mumbai',
                Contact: '022-27640001',
                Status: 'Active',
                ITI_score: 88,
            },
            {
                Name: 'Government ITI Delhi',
                City: 'New Delhi',
                State: 'Delhi',
                Address: 'Pusa Road, Karol Bagh',
                Contact: '011-25840002',
                Status: 'Active',
                ITI_score: 92,
            },
            {
                Name: 'Government ITI Chennai',
                City: 'Chennai',
                State: 'Tamil Nadu',
                Address: 'T Nagar, GN Chetty Road',
                Contact: '044-24330003',
                Status: 'Active',
                ITI_score: 81,
            },
            {
                Name: 'Government ITI Bengaluru',
                City: 'Bengaluru',
                State: 'Karnataka',
                Address: 'Rajajinagar Industrial Area',
                Contact: '080-23340004',
                Status: 'Active',
                ITI_score: 86,
            },
            {
                Name: 'Government ITI Pune',
                City: 'Pune',
                State: 'Maharashtra',
                Address: 'Shivajinagar, JM Road',
                Contact: '020-25540005',
                Status: 'Inactive',
                ITI_score: 74,
            },
            {
                Name: 'Government ITI Hyderabad',
                City: 'Hyderabad',
                State: 'Telangana',
                Address: 'Ameerpet Main Road',
                Contact: '040-27640006',
                Status: 'Active',
                ITI_score: 89,
            },
            {
                Name: 'Government ITI Ahmedabad',
                City: 'Ahmedabad',
                State: 'Gujarat',
                Address: 'Naranpura Industrial Estate',
                Contact: '079-25540007',
                Status: 'Active',
                ITI_score: 80,
            },
            {
                Name: 'Government ITI Jaipur',
                City: 'Jaipur',
                State: 'Rajasthan',
                Address: 'Tonk Road, Sitapura',
                Contact: '0141-25540008',
                Status: 'Active',
                ITI_score: 82,
            },
            {
                Name: 'Government ITI Kolkata',
                City: 'Kolkata',
                State: 'West Bengal',
                Address: 'Salt Lake Sector V',
                Contact: '033-23340009',
                Status: 'Active',
                ITI_score: 87,
            },
            {
                Name: 'Government ITI Lucknow',
                City: 'Lucknow',
                State: 'Uttar Pradesh',
                Address: 'Alambagh Industrial Area',
                Contact: '0522-25540010',
                Status: 'Active',
                ITI_score: 79,
            },
        ],
    });

    const itis = await prisma.iTI.findMany();
    const itiByName = (namePart) => itis.find((i) => i.Name.includes(namePart));

    const itiMumbai = itiByName('Mumbai');
    const itiDelhi = itiByName('Delhi');
    const itiChennai = itiByName('Chennai');
    const itiBengaluru = itiByName('Bengaluru');
    const itiPune = itiByName('Pune');
    const itiHyderabad = itiByName('Hyderabad');
    const itiAhmedabad = itiByName('Ahmedabad');
    const itiJaipur = itiByName('Jaipur');
    const itiKolkata = itiByName('Kolkata');
    const itiLucknow = itiByName('Lucknow');

    // 2) Trades (10)
    await prisma.trades.createMany({
        data: [
            {
                ITI_ID: itiMumbai.ITI_ID,
                Trade_Name: 'Electrician',
                Duration: '2 Years',
                Syllabus: 'Wiring, motors, safety, industrial electrical systems',
                Certification: 'NCVT',
            },
            {
                ITI_ID: itiMumbai.ITI_ID,
                Trade_Name: 'Fitter',
                Duration: '2 Years',
                Syllabus: 'Fitting, machining, tools handling',
                Certification: 'NCVT',
            },
            {
                ITI_ID: itiDelhi.ITI_ID,
                Trade_Name: 'COPA',
                Duration: '1 Year',
                Syllabus: 'Computer basics, office automation, internet',
                Certification: 'NCVT',
            },
            {
                ITI_ID: itiChennai.ITI_ID,
                Trade_Name: 'Mechanic Motor Vehicle',
                Duration: '2 Years',
                Syllabus: 'Engine repair, servicing, diagnostics',
                Certification: 'NCVT',
            },
            {
                ITI_ID: itiBengaluru.ITI_ID,
                Trade_Name: 'Turner',
                Duration: '2 Years',
                Syllabus: 'Lathe operations, turning, CNC basics',
                Certification: 'NCVT',
            },
            {
                ITI_ID: itiHyderabad.ITI_ID,
                Trade_Name: 'Welder',
                Duration: '1 Year',
                Syllabus: 'Gas welding, arc welding, safety',
                Certification: 'NCVT',
            },
            {
                ITI_ID: itiAhmedabad.ITI_ID,
                Trade_Name: 'Machinist',
                Duration: '2 Years',
                Syllabus: 'Milling, drilling, surface grinding',
                Certification: 'NCVT',
            },
            {
                ITI_ID: itiJaipur.ITI_ID,
                Trade_Name: 'Refrigeration and Air-Conditioning',
                Duration: '2 Years',
                Syllabus: 'AC installation, compressor, gas charging',
                Certification: 'NCVT',
            },
            {
                ITI_ID: itiKolkata.ITI_ID,
                Trade_Name: 'Electronics Mechanic',
                Duration: '2 Years',
                Syllabus: 'Electronic circuits, PCB, instruments',
                Certification: 'NCVT',
            },
            {
                ITI_ID: itiLucknow.ITI_ID,
                Trade_Name: 'Plumber',
                Duration: '1 Year',
                Syllabus: 'Pipes, fittings, sanitary maintenance',
                Certification: 'NCVT',
            },
        ],
    });

    const trades = await prisma.trades.findMany();

    // 3) ITI Workers (10) with WorkerRole
    await prisma.iTI_Workers.createMany({
        data: [
            {
                ITI_ID: itiMumbai.ITI_ID,
                Name: 'Rahul Deshmukh',
                Role: WorkerRole.TRAINING_OFFICER,
                Experience: 10,
                Salary: 55000,
                Contact: '9876543210',
                Active_Status: true,
            },
            {
                ITI_ID: itiMumbai.ITI_ID,
                Name: 'Sneha Kulkarni',
                Role: WorkerRole.ASSISTANT_TRAINING_OFFICER,
                Experience: 6,
                Salary: 48000,
                Contact: '9876500011',
                Active_Status: true,
            },
            {
                ITI_ID: itiDelhi.ITI_ID,
                Name: 'Amit Verma',
                Role: WorkerRole.POLICY_MAKER,
                Experience: 8,
                Salary: 52000,
                Contact: '9811000022',
                Active_Status: true,
            },
            {
                ITI_ID: itiChennai.ITI_ID,
                Name: 'Priya Narayanan',
                Role: WorkerRole.LAB_PRINCIPAL,
                Experience: 7,
                Salary: 50000,
                Contact: '9894000033',
                Active_Status: true,
            },
            {
                ITI_ID: itiBengaluru.ITI_ID,
                Name: 'Karthik R',
                Role: WorkerRole.TRAINING_OFFICER,
                Experience: 5,
                Salary: 47000,
                Contact: '9916000044',
                Active_Status: true,
            },
            {
                ITI_ID: itiHyderabad.ITI_ID,
                Name: 'Farhan Ali',
                Role: WorkerRole.ASSISTANT_TRAINING_OFFICER,
                Experience: 9,
                Salary: 49000,
                Contact: '9898000055',
                Active_Status: true,
            },
            {
                ITI_ID: itiAhmedabad.ITI_ID,
                Name: 'Neha Shah',
                Role: WorkerRole.LAB_PRINCIPAL,
                Experience: 6,
                Salary: 46000,
                Contact: '9825000066',
                Active_Status: true,
            },
            {
                ITI_ID: itiJaipur.ITI_ID,
                Name: 'Ramesh Singh',
                Role: WorkerRole.TRAINING_OFFICER,
                Experience: 11,
                Salary: 54000,
                Contact: '9928000077',
                Active_Status: true,
            },
            {
                ITI_ID: itiKolkata.ITI_ID,
                Name: 'Sourav Dutta',
                Role: WorkerRole.ASSISTANT_TRAINING_OFFICER,
                Experience: 8,
                Salary: 51000,
                Contact: '9830000088',
                Active_Status: true,
            },
            {
                ITI_ID: itiLucknow.ITI_ID,
                Name: 'Anita Yadav',
                Role: WorkerRole.POLICY_MAKER,
                Experience: 4,
                Salary: 42000,
                Contact: '9839000099',
                Active_Status: true,
            },
        ],
    });

    const workers = await prisma.iTI_Workers.findMany();

    // 4) Students (10)
    await prisma.students.createMany({
        data: [
            {
                ITI_ID: itiMumbai.ITI_ID,
                Trade_ID: trades.find((t) => t.Trade_Name === 'Electrician').Trade_ID,
                Worker_ID: workers.find((w) => w.Name === 'Rahul Deshmukh').Worker_ID,
                Name: 'Aditya Pawar',
                Batch: '2024-2026',
                Email: 'aditya.pawar@example.com',
                Gender: 'Male',
                Year: 1,
                Admission_Date: new Date('2024-08-01'),
                Placed: false,
            },
            {
                ITI_ID: itiMumbai.ITI_ID,
                Trade_ID: trades.find((t) => t.Trade_Name === 'Fitter').Trade_ID,
                Worker_ID: workers.find((w) => w.Name === 'Sneha Kulkarni').Worker_ID,
                Name: 'Rohan Shinde',
                Batch: '2023-2025',
                Email: 'rohan.shinde@example.com',
                Gender: 'Male',
                Year: 2,
                Admission_Date: new Date('2023-08-01'),
                Placed: true,
            },
            {
                ITI_ID: itiDelhi.ITI_ID,
                Trade_ID: trades.find((t) => t.Trade_Name === 'COPA').Trade_ID,
                Worker_ID: workers.find((w) => w.Name === 'Amit Verma').Worker_ID,
                Name: 'Shreya Gupta',
                Batch: '2024-2025',
                Email: 'shreya.gupta@example.com',
                Gender: 'Female',
                Year: 1,
                Admission_Date: new Date('2024-07-20'),
                Placed: false,
            },
            {
                ITI_ID: itiChennai.ITI_ID,
                Trade_ID: trades.find((t) => t.Trade_Name === 'Mechanic Motor Vehicle').Trade_ID,
                Worker_ID: workers.find((w) => w.Name === 'Priya Narayanan').Worker_ID,
                Name: 'Vignesh K',
                Batch: '2023-2025',
                Email: 'vignesh.k@example.com',
                Gender: 'Male',
                Year: 2,
                Admission_Date: new Date('2023-07-25'),
                Placed: false,
            },
            {
                ITI_ID: itiBengaluru.ITI_ID,
                Trade_ID: trades.find((t) => t.Trade_Name === 'Turner').Trade_ID,
                Worker_ID: workers.find((w) => w.Name === 'Karthik R').Worker_ID,
                Name: 'Nandini S',
                Batch: '2024-2026',
                Email: 'nandini.s@example.com',
                Gender: 'Female',
                Year: 1,
                Admission_Date: new Date('2024-08-05'),
                Placed: false,
            },
            {
                ITI_ID: itiHyderabad.ITI_ID,
                Trade_ID: trades.find((t) => t.Trade_Name === 'Welder').Trade_ID,
                Worker_ID: workers.find((w) => w.Name === 'Farhan Ali').Worker_ID,
                Name: 'Imran Khan',
                Batch: '2023-2024',
                Email: 'imran.khan@example.com',
                Gender: 'Male',
                Year: 1,
                Admission_Date: new Date('2023-08-10'),
                Placed: false,
            },
            {
                ITI_ID: itiAhmedabad.ITI_ID,
                Trade_ID: trades.find((t) => t.Trade_Name === 'Machinist').Trade_ID,
                Worker_ID: workers.find((w) => w.Name === 'Neha Shah').Worker_ID,
                Name: 'Kajal Patel',
                Batch: '2024-2026',
                Email: 'kajal.patel@example.com',
                Gender: 'Female',
                Year: 1,
                Admission_Date: new Date('2024-07-30'),
                Placed: false,
            },
            {
                ITI_ID: itiJaipur.ITI_ID,
                Trade_ID: trades.find((t) => t.Trade_Name === 'Refrigeration and Air-Conditioning').Trade_ID,
                Worker_ID: workers.find((w) => w.Name === 'Ramesh Singh').Worker_ID,
                Name: 'Deepak Meena',
                Batch: '2023-2025',
                Email: 'deepak.meena@example.com',
                Gender: 'Male',
                Year: 2,
                Admission_Date: new Date('2023-08-02'),
                Placed: false,
            },
            {
                ITI_ID: itiKolkata.ITI_ID,
                Trade_ID: trades.find((t) => t.Trade_Name === 'Electronics Mechanic').Trade_ID,
                Worker_ID: workers.find((w) => w.Name === 'Sourav Dutta').Worker_ID,
                Name: 'Ananya Sen',
                Batch: '2024-2026',
                Email: 'ananya.sen@example.com',
                Gender: 'Female',
                Year: 1,
                Admission_Date: new Date('2024-08-03'),
                Placed: false,
            },
            {
                ITI_ID: itiLucknow.ITI_ID,
                Trade_ID: trades.find((t) => t.Trade_Name === 'Plumber').Trade_ID,
                Worker_ID: workers.find((w) => w.Name === 'Anita Yadav').Worker_ID,
                Name: 'Rahul Mishra',
                Batch: '2023-2024',
                Email: 'rahul.mishra@example.com',
                Gender: 'Male',
                Year: 1,
                Admission_Date: new Date('2023-07-28'),
                Placed: false,
            },
        ],
    });

    const students = await prisma.students.findMany();

    // 5) Machines (10) with MachineStatus + Faults counter
    await prisma.machines.createMany({
        data: [
            {
                ITI_ID: itiMumbai.ITI_ID,
                Machine_Name: 'Lathe Machine - HMT',
                Type: 'Lathe',
                Model_No: 'HMT-LT200',
                Manufacturer: 'HMT Limited',
                Installation_Date: new Date('2019-06-10'),
                Last_Service_Date: new Date('2024-03-15'),
                Warranty_Expiry_Date: new Date('2024-06-10'),
                Status: MachineStatus.HEALTHY,
                Last_used: new Date('2024-11-20'),
                Faults: 0,
            },
            {
                ITI_ID: itiMumbai.ITI_ID,
                Machine_Name: 'Drilling Machine',
                Type: 'Drill',
                Model_No: 'DR-450',
                Manufacturer: 'Bosch',
                Installation_Date: new Date('2020-01-05'),
                Last_Service_Date: new Date('2024-02-01'),
                Warranty_Expiry_Date: new Date('2025-01-05'),
                Status: MachineStatus.HEALTHY,
                Last_used: new Date('2024-11-19'),
                Faults: 1,
            },
            {
                ITI_ID: itiDelhi.ITI_ID,
                Machine_Name: 'Computer Lab System',
                Type: 'Computer',
                Model_No: 'Dell OptiPlex 7080',
                Manufacturer: 'Dell',
                Installation_Date: new Date('2021-07-01'),
                Last_Service_Date: new Date('2024-05-10'),
                Warranty_Expiry_Date: new Date('2024-07-01'),
                Status: MachineStatus.ALERT,
                Last_used: new Date('2024-11-18'),
                Faults: 2,
            },
            {
                ITI_ID: itiChennai.ITI_ID,
                Machine_Name: 'Automotive Engine Test Rig',
                Type: 'Test Rig',
                Model_No: 'MMV-TR100',
                Manufacturer: 'Ashok Leyland',
                Installation_Date: new Date('2018-03-20'),
                Last_Service_Date: new Date('2024-01-10'),
                Warranty_Expiry_Date: new Date('2021-03-20'),
                Status: MachineStatus.CRITICAL,
                Last_used: new Date('2024-10-30'),
                Faults: 4,
            },
            {
                ITI_ID: itiBengaluru.ITI_ID,
                Machine_Name: 'CNC Lathe Trainer',
                Type: 'CNC',
                Model_No: 'CNC-TN500',
                Manufacturer: 'Siemens',
                Installation_Date: new Date('2022-09-15'),
                Last_Service_Date: new Date('2024-06-12'),
                Warranty_Expiry_Date: new Date('2025-09-15'),
                Status: MachineStatus.HEALTHY,
                Last_used: new Date('2024-11-21'),
                Faults: 0,
            },
            {
                ITI_ID: itiHyderabad.ITI_ID,
                Machine_Name: 'Arc Welding Set',
                Type: 'Welder',
                Model_No: 'ARC-300',
                Manufacturer: 'Ador Welding',
                Installation_Date: new Date('2020-11-10'),
                Last_Service_Date: new Date('2024-04-05'),
                Warranty_Expiry_Date: new Date('2023-11-10'),
                Status: MachineStatus.ALERT,
                Last_used: new Date('2024-11-15'),
                Faults: 2,
            },
            {
                ITI_ID: itiAhmedabad.ITI_ID,
                Machine_Name: 'Milling Machine',
                Type: 'Milling',
                Model_No: 'MILL-500',
                Manufacturer: 'Batliboi',
                Installation_Date: new Date('2019-08-18'),
                Last_Service_Date: new Date('2024-02-20'),
                Warranty_Expiry_Date: new Date('2022-08-18'),
                Status: MachineStatus.HEALTHY,
                Last_used: new Date('2024-11-17'),
                Faults: 1,
            },
            {
                ITI_ID: itiJaipur.ITI_ID,
                Machine_Name: 'Split AC Training Unit',
                Type: 'AC Trainer',
                Model_No: 'RAC-TR200',
                Manufacturer: 'Blue Star',
                Installation_Date: new Date('2021-03-01'),
                Last_Service_Date: new Date('2024-03-01'),
                Warranty_Expiry_Date: new Date('2024-03-01'),
                Status: MachineStatus.ALERT,
                Last_used: new Date('2024-11-16'),
                Faults: 2,
            },
            {
                ITI_ID: itiKolkata.ITI_ID,
                Machine_Name: 'Electronics Workbench',
                Type: 'Electronics Bench',
                Model_No: 'ELB-100',
                Manufacturer: 'Scientific Lab India',
                Installation_Date: new Date('2020-02-10'),
                Last_Service_Date: new Date('2024-05-05'),
                Warranty_Expiry_Date: new Date('2023-02-10'),
                Status: MachineStatus.HEALTHY,
                Last_used: new Date('2024-11-14'),
                Faults: 1,
            },
            {
                ITI_ID: itiLucknow.ITI_ID,
                Machine_Name: 'Pipe Threading Machine',
                Type: 'Plumbing',
                Model_No: 'PTM-250',
                Manufacturer: 'Ridgid',
                Installation_Date: new Date('2019-09-05'),
                Last_Service_Date: new Date('2024-01-20'),
                Warranty_Expiry_Date: new Date('2022-09-05'),
                Status: MachineStatus.ALERT,
                Last_used: new Date('2024-11-13'),
                Faults: 3,
            },
        ],
    });

    const machines = await prisma.machines.findMany();

    // 6) Maintenance Workers (10)
    await prisma.maintenance_Workers.createMany({
        data: [
            {
                ITI_ID: itiMumbai.ITI_ID,
                Name: 'Sanjay Patil',
                Experience: 7,
                Salary: '45000',
                Contact: '9876700001',
                last_worked: new Date('2024-11-20'),
                Active_Status: true,
                Solved_cases: 35,
                pending: '2 minor issues',
            },
            {
                ITI_ID: itiDelhi.ITI_ID,
                Name: 'Manoj Sharma',
                Experience: 5,
                Salary: '42000',
                Contact: '9876700002',
                last_worked: new Date('2024-11-18'),
                Active_Status: true,
                Solved_cases: 24,
                pending: '1 computer not booting',
            },
            {
                ITI_ID: itiChennai.ITI_ID,
                Name: 'Ravi Kumar',
                Experience: 9,
                Salary: '48000',
                Contact: '9876700003',
                last_worked: new Date('2024-11-15'),
                Active_Status: true,
                Solved_cases: 40,
                pending: 'Engine test rig vibration issue',
            },
            {
                ITI_ID: itiBengaluru.ITI_ID,
                Name: 'Harish Gowda',
                Experience: 6,
                Salary: '44000',
                Contact: '9876700004',
                last_worked: new Date('2024-11-19'),
                Active_Status: true,
                Solved_cases: 28,
                pending: '1 CNC alignment check',
            },
            {
                ITI_ID: itiPune.ITI_ID,
                Name: 'Vikas Jadhav',
                Experience: 4,
                Salary: '40000',
                Contact: '9876700005',
                last_worked: new Date('2024-10-30'),
                Active_Status: false,
                Solved_cases: 18,
                pending: 'On leave',
            },
            {
                ITI_ID: itiHyderabad.ITI_ID,
                Name: 'Arun Reddy',
                Experience: 8,
                Salary: '47000',
                Contact: '9876700006',
                last_worked: new Date('2024-11-17'),
                Active_Status: true,
                Solved_cases: 32,
                pending: 'Welder cable replacement',
            },
            {
                ITI_ID: itiAhmedabad.ITI_ID,
                Name: 'Mahesh Patel',
                Experience: 7,
                Salary: '46000',
                Contact: '9876700007',
                last_worked: new Date('2024-11-16'),
                Active_Status: true,
                Solved_cases: 29,
                pending: 'Milling machine oil top-up',
            },
            {
                ITI_ID: itiJaipur.ITI_ID,
                Name: 'Nitin Sharma',
                Experience: 5,
                Salary: '43000',
                Contact: '9876700008',
                last_worked: new Date('2024-11-12'),
                Active_Status: true,
                Solved_cases: 21,
                pending: 'AC gas leak check',
            },
            {
                ITI_ID: itiKolkata.ITI_ID,
                Name: 'Arindam Ghosh',
                Experience: 6,
                Salary: '44500',
                Contact: '9876700009',
                last_worked: new Date('2024-11-11'),
                Active_Status: true,
                Solved_cases: 26,
                pending: 'Oscilloscope calibration',
            },
            {
                ITI_ID: itiLucknow.ITI_ID,
                Name: 'Sandeep Tiwari',
                Experience: 3,
                Salary: '39000',
                Contact: '9876700010',
                last_worked: new Date('2024-11-09'),
                Active_Status: true,
                Solved_cases: 15,
                pending: 'Pipe threading machine noise',
            },
        ],
    });

    const mWorkers = await prisma.maintenance_Workers.findMany();

    // 7) Inventory (10)
    await prisma.inventory.createMany({
        data: [
            {
                Item_Name: 'Copper Cable Roll',
                Quantity: 50,
                Reorder_Level: 20,
                Worker_ID: workers.find((w) => w.Name === 'Rahul Deshmukh').Worker_ID,
            },
            {
                Item_Name: 'Insulation Tape',
                Quantity: 200,
                Reorder_Level: 50,
                Worker_ID: workers.find((w) => w.Name === 'Sneha Kulkarni').Worker_ID,
            },
            {
                Item_Name: 'Engine Oil 5L Can',
                Quantity: 30,
                Reorder_Level: 10,
                Worker_ID: workers.find((w) => w.Name === 'Priya Narayanan').Worker_ID,
            },
            {
                Item_Name: 'Lathe Cutting Tool Set',
                Quantity: 15,
                Reorder_Level: 5,
                Worker_ID: workers.find((w) => w.Name === 'Karthik R').Worker_ID,
            },
            {
                Item_Name: 'Desktop RAM 8GB',
                Quantity: 25,
                Reorder_Level: 8,
                Worker_ID: workers.find((w) => w.Name === 'Amit Verma').Worker_ID,
            },
            {
                Item_Name: 'Welding Electrodes Pack',
                Quantity: 60,
                Reorder_Level: 20,
                Worker_ID: workers.find((w) => w.Name === 'Farhan Ali').Worker_ID,
            },
            {
                Item_Name: 'Cutting Fluid Barrel',
                Quantity: 10,
                Reorder_Level: 3,
                Worker_ID: workers.find((w) => w.Name === 'Neha Shah').Worker_ID,
            },
            {
                Item_Name: 'AC Copper Tubing Coil',
                Quantity: 18,
                Reorder_Level: 5,
                Worker_ID: workers.find((w) => w.Name === 'Ramesh Singh').Worker_ID,
            },
            {
                Item_Name: 'Resistor Assorted Kit',
                Quantity: 100,
                Reorder_Level: 30,
                Worker_ID: workers.find((w) => w.Name === 'Sourav Dutta').Worker_ID,
            },
            {
                Item_Name: 'PVC Pipe 2 inch',
                Quantity: 40,
                Reorder_Level: 10,
                Worker_ID: workers.find((w) => w.Name === 'Anita Yadav').Worker_ID,
            },
        ],
    });

    const inventory = await prisma.inventory.findMany();

    // 8) Auctions (4)
    await prisma.auctions.createMany({
        data: [
            {
                Item_ID: inventory.find((i) => i.Item_Name === 'Lathe Cutting Tool Set').Item_ID,
                ITI_ID: itiBengaluru.ITI_ID,
                Item_Name: 'Lathe Cutting Tool Set (Old Batch)',
                Quantity: 5,
                Base_Price: 8000,
                Bids: 3,
            },
            {
                Item_ID: inventory.find((i) => i.Item_Name === 'Engine Oil 5L Can').Item_ID,
                ITI_ID: itiChennai.ITI_ID,
                Item_Name: 'Old Engine Oil Stock',
                Quantity: 10,
                Base_Price: 3000,
                Bids: 2,
            },
            {
                Item_ID: inventory.find((i) => i.Item_Name === 'Welding Electrodes Pack').Item_ID,
                ITI_ID: itiHyderabad.ITI_ID,
                Item_Name: 'Damaged Electrode Cartons',
                Quantity: 8,
                Base_Price: 1500,
                Bids: 1,
            },
            {
                Item_ID: inventory.find((i) => i.Item_Name === 'PVC Pipe 2 inch').Item_ID,
                ITI_ID: itiLucknow.ITI_ID,
                Item_Name: 'Old PVC Pipe Stock',
                Quantity: 12,
                Base_Price: 2500,
                Bids: 0,
            },
        ],
    });

    // 9) Maintenance Logs (5)
    await prisma.maintenance_Log.createMany({
        data: [
            {
                ITI_ID: itiChennai.ITI_ID,
                Machine_ID: machines.find((m) => m.Machine_Name === 'Automotive Engine Test Rig').Machine_ID,
                M_Worker_ID: mWorkers.find((mw) => mw.Name === 'Ravi Kumar').M_Worker_ID,
                Worker_ID: workers.find((w) => w.Name === 'Priya Narayanan').Worker_ID,
                Issue_Reported: 'Excessive vibration during high RPM',
                Action_Taken: 'Checked mounts, recommended bearing replacement',
                Severity: 'High',
                Status: 'Pending',
                Report_Date: new Date('2024-11-10'),
                Next_Service_Date: new Date('2024-12-01'),
            },
            {
                ITI_ID: itiMumbai.ITI_ID,
                Machine_ID: machines.find((m) => m.Machine_Name === 'Lathe Machine - HMT').Machine_ID,
                M_Worker_ID: mWorkers.find((mw) => mw.Name === 'Sanjay Patil').M_Worker_ID,
                Worker_ID: workers.find((w) => w.Name === 'Rahul Deshmukh').Worker_ID,
                Issue_Reported: 'Tailstock misalignment',
                Action_Taken: 'Realigned and tested with trial piece',
                Severity: 'Medium',
                Status: 'Resolved',
                Report_Date: new Date('2024-10-15'),
                Next_Service_Date: new Date('2025-01-15'),
            },
            {
                ITI_ID: itiHyderabad.ITI_ID,
                Machine_ID: machines.find((m) => m.Machine_Name === 'Arc Welding Set').Machine_ID,
                M_Worker_ID: mWorkers.find((mw) => mw.Name === 'Arun Reddy').M_Worker_ID,
                Worker_ID: workers.find((w) => w.Name === 'Farhan Ali').Worker_ID,
                Issue_Reported: 'Welding current fluctuation',
                Action_Taken: 'Cleaned connections, tightened terminals',
                Severity: 'Medium',
                Status: 'Resolved',
                Report_Date: new Date('2024-09-20'),
                Next_Service_Date: new Date('2024-12-20'),
            },
            {
                ITI_ID: itiKolkata.ITI_ID,
                Machine_ID: machines.find((m) => m.Machine_Name === 'Electronics Workbench').Machine_ID,
                M_Worker_ID: mWorkers.find((mw) => mw.Name === 'Arindam Ghosh').M_Worker_ID,
                Worker_ID: workers.find((w) => w.Name === 'Sourav Dutta').Worker_ID,
                Issue_Reported: 'Power supply output unstable',
                Action_Taken: 'Replaced faulty regulator IC',
                Severity: 'High',
                Status: 'Resolved',
                Report_Date: new Date('2024-08-05'),
                Next_Service_Date: new Date('2024-11-05'),
            },
            {
                ITI_ID: itiLucknow.ITI_ID,
                Machine_ID: machines.find((m) => m.Machine_Name === 'Pipe Threading Machine').Machine_ID,
                M_Worker_ID: mWorkers.find((mw) => mw.Name === 'Sandeep Tiwari').M_Worker_ID,
                Worker_ID: workers.find((w) => w.Name === 'Anita Yadav').Worker_ID,
                Issue_Reported: 'Unusual noise from threading head',
                Action_Taken: 'Lubricated gears, scheduled bearing inspection',
                Severity: 'Low',
                Status: 'In Progress',
                Report_Date: new Date('2024-10-01'),
                Next_Service_Date: new Date('2024-12-01'),
            },
        ],
    });

    // 10) Schedule Logs (4–5)
    await prisma.schedule_Logs.createMany({
        data: [
            {
                ITI_ID: itiMumbai.ITI_ID,
                Machine_ID: machines.find((m) => m.Machine_Name === 'Lathe Machine - HMT').Machine_ID,
                Worker_ID: workers.find((w) => w.Name === 'Rahul Deshmukh').Worker_ID,
                Student_ID: students.find((s) => s.Name === 'Aditya Pawar').Student_ID,
                Time: 2,
                Scheduled_On: new Date('2024-11-25T10:00:00'),
                Completed_At: new Date('2024-11-25T12:15:00'),
            },
            {
                ITI_ID: itiDelhi.ITI_ID,
                Machine_ID: machines.find((m) => m.Machine_Name === 'Computer Lab System').Machine_ID,
                Worker_ID: workers.find((w) => w.Name === 'Amit Verma').Worker_ID,
                Student_ID: students.find((s) => s.Name === 'Shreya Gupta').Student_ID,
                Time: 3,
                Scheduled_On: new Date('2024-11-26T09:00:00'),
                Completed_At: null,
            },
            {
                ITI_ID: itiHyderabad.ITI_ID,
                Machine_ID: machines.find((m) => m.Machine_Name === 'Arc Welding Set').Machine_ID,
                Worker_ID: workers.find((w) => w.Name === 'Farhan Ali').Worker_ID,
                Student_ID: students.find((s) => s.Name === 'Imran Khan').Student_ID,
                Time: 2,
                Scheduled_On: new Date('2024-11-27T14:00:00'),
                Completed_At: null,
            },
            {
                ITI_ID: itiKolkata.ITI_ID,
                Machine_ID: machines.find((m) => m.Machine_Name === 'Electronics Workbench').Machine_ID,
                Worker_ID: workers.find((w) => w.Name === 'Sourav Dutta').Worker_ID,
                Student_ID: students.find((s) => s.Name === 'Ananya Sen').Student_ID,
                Time: 2,
                Scheduled_On: new Date('2024-11-28T11:00:00'),
                Completed_At: null,
            },
        ],
    });

    console.log('Seeding completed.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
