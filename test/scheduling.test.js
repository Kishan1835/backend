// simple test for buildScheduleRows
import { buildScheduleRows } from '../src/services/scheduling.service.js';

const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

const run = () => {
    const students = [{ Student_ID: 1, ITI_ID: 1 }, { Student_ID: 2, ITI_ID: 1 }];
    const machines = [{ Machine_ID: 101 }, { Machine_ID: 102 }];
    const { logs, usedMachineIds } = buildScheduleRows({ students, machines, timeSlotMinutes: 60, workerId: 5 });

    assert(logs.length === 2, 'expected 2 logs');
    assert(usedMachineIds.length === 2, 'expected 2 used machines');
    console.log('scheduling.buildScheduleRows OK');
};

try { run(); console.log('ALL TESTS PASSED'); } catch (err) { console.error('TEST FAILED', err.message); process.exit(1); }
