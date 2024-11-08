function generateRandomScore(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateGolfScores(rounds, holes, playerName) {
    const scores = [];
    const date = "2024-11-13"; // Fixed date for simplicity

    for (let i = 0; i < rounds; i++) {
        const roundScores = {};
        let totalScore = 0;

        for (let j = 0; j < holes; j++) {
            const score = generateRandomScore(1, 10);
            roundScores[j] = score.toString();
            totalScore += score;
        }

        scores.push({
            date: date,
            playerName: playerName,
            round: i + 1,
            scores: roundScores,
            totalScore: totalScore
        });
    }

    return scores;
}

const golfScores = generateGolfScores(4, 18, "Jace Randolph");
console.log(golfScores);

const rounds = golfScores;

module.exports = rounds;