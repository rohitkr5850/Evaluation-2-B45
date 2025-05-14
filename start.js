const fs = require('fs-extra');
const path = require('path');
const { getRandomDuration } = require('./utils/random');
const logStream = fs.createWriteStream('logs.txt',{flags: 'a'});

const PROCESSING_DIR = 'processing';
const IN_PROGRESS_DIR = 'in-progress';
const COMPLETED_DIR = 'completed';
const CRASHED_DIR = 'crashed';

fs.ensureDirSync(PROCESSING_DIR);
fs.ensureDirSync(IN_PROGRESS_DIR);
fs.ensureDirSync(COMPLETED_DIR);
fs.ensureDirSync(CRASHED_DIR);

function logStatus(file , status){
    const time = new Date().toISOString();
    const log = `[${time}] File: ${file} - Status: ${status}\n`;
    logStream.write(log);
    console.log(log.trim());
}

function createFile(){
    const timestamp = Date.now();
    const filename = `file_${timestamp}.txt`;
    const filepath = path.join(PROCESSING_DIR , filename);
    const duration = getRandomDuration();

    fs.writeFileSync(filepath, `File Started Processing\nDuration: ${duration}\n`);
    console.log(`Created ${filename} with ${duration}s duration`);

    setTimeout(() => 
    moveToInProgress(filename , duration), 1000);
}

function moveToInProgress(filename,duration){
        const oldPath = path.join(PROCESSING_DIR , filename);
        const newPath = path.join(IN_PROGRESS_DIR , filename);

        fs.moveSync(oldPath , newPath);
        fs.appendFileSync(newPath,`Status: In-Progress\n`);
        logStatus(filename , 'In-Progress');

        const warningTimer = setTimeout(() => {
            logStatus(filename, 'WARNING: Still In-Progress after 3s');
        },3000);

        const finalTimer = setTimeout(() => {
            const completed = duration < 5;
            const status = completed ?
            'Final-Status: Completed':
            'Final-Status: Crashed';
            const destDir = completed ?
            COMPLETED_DIR : CRASHED_DIR;

            const currentPath = path.join(IN_PROGRESS_DIR, filename);
            fs.appendFileSync(currentPath,`${status}\nTime: ${new
                Date().toISOString()}\n`);
                logStatus(filename,status);

                fs.moveSync(currentPath,path.join(destDir,filename));

                if(!completed){
                    logStatus(filename,'Error: File not processed in 5s');
                }
                clearTimeout(warningTimer);
        },duration * 1000);
    }
    console.log('File processor started...');
    setInterval(createFile,3000);
