import readline from 'readline';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });



let correctCount = 0;
let wrongCount = 0;
let isRunning = true;
const endTime = Date.now() + 30 * 1000;

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 90 + 10); // 10–99
    const num2 = Math.floor(Math.random() * 90 + 10);
    const correctAnswer = num1 * num2;

    let options = new Set([correctAnswer]);
    while (options.size < 3) {
        options.add(correctAnswer + Math.floor(Math.random() * 21 - 10)); // +/-10 range
    }
    const optionArray = Array.from(options);
    const shuffled = optionArray.sort(() => Math.random() - 0.5);

    const labels = ['a', 'b', 'c'];
    const labeledOptions = shuffled.map((opt, i) => ({
        label: labels[i],
        value: opt
    }));

    const correctLabel = labeledOptions.find(opt => opt.value === correctAnswer).label;
    return {
        question: `${num1} × ${num2} = ?`,
        options: labeledOptions,
        correctLabel
    };
}

function askQuestion() {
    if (!isRunning || Date.now() > endTime) {
        console.log(`\n⏱ Time's up!`);
        console.log(` Correct: ${correctCount}`);
        console.log(` Wrong: ${wrongCount}`);
        rl.close();
        return;
    }
    const { question, options, correctLabel } = generateQuestion();

    console.log(`\n${question}`);
    options.forEach(opt => {
        console.log(`${opt.label}: ${opt.value}`);
    });

    rl.question("Your answer (a/b/c): ", (answer) => {
        if (answer.toLowerCase() === correctLabel) {
            correctCount++;
        } else {
            wrongCount++;
        }

        askQuestion(); // Ask next question
    });
}

console.log("🎮 Welcome to DigitDash CLI Edition!");
console.log("You have 30 seconds. Let's go!");
askQuestion();

