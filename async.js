'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {

    return new Promise(resolve => {
        if (jobs.length === 0) {
            resolve([]);
        }

        const jobsResult = [];
        const promiseParallelNum = jobs.length > parallelNum ? parallelNum : jobs.length;

        let currentJobIndex = 0;

        for (let i = 0; i < promiseParallelNum; i++) {
            makeJob(jobs[i], currentJobIndex++);
        }

        function makeJob(job, currentIndex) {
            let startCurrentJob = currentJobResult => startNextJob(currentJobResult, currentIndex);

            Promise.race([job(), startTimer()])
                .then(startCurrentJob, startCurrentJob);
        }

        function startTimer() {
            return new Promise((secondResolve, reject) => {
                setTimeout(() => {
                    reject(new Error('Promise timeout'));
                }, timeout);
            });
        }

        function startNextJob(currentJobResult, currentIndex) {
            jobsResult[currentIndex] = currentJobResult;
            if (currentJobIndex === jobs.length) {
                resolve(jobsResult);
            }
            if (currentJobIndex < jobs.length) {
                makeJob(jobs[currentJobIndex], currentJobIndex++);
            }
        }
    });
}

module.exports = {
    runParallel,

    isStar
};
