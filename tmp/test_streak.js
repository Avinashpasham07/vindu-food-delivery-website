
const checkStreak = (streakCount, lastOrderDate, now) => {
    if (!lastOrderDate) return streakCount;
    const diffInTime = now.getTime() - lastOrderDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    if (diffInDays > 2) {
        return 0; // Broken
    }
    return streakCount;
};

const updateStreakOnOrder = (streakCount, lastOrderDate, now) => {
    if (!lastOrderDate) return 1;
    const diffInTime = now.getTime() - lastOrderDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    if (diffInDays === 1) {
        return streakCount + 1;
    } else if (diffInDays > 1) {
        return 1;
    }
    return streakCount; // Same day
};

const lastOrder = new Date("2026-04-07T10:00:00Z");
const streak = 5;

console.log("Scenario 1: 36 hours later (Next day)");
const now1 = new Date("2026-04-08T22:00:00Z");
let currentStreak = checkStreak(streak, lastOrder, now1);
console.log("Middleware Check:", currentStreak); // Should be 5
console.log("Order Update:", updateStreakOnOrder(currentStreak, lastOrder, now1)); // Should be 6

console.log("\nScenario 2: 60 hours later (2 days later)");
const now2 = new Date("2026-04-09T22:00:00Z");
currentStreak = checkStreak(streak, lastOrder, now2);
console.log("Middleware Check:", currentStreak); // Should be 0
console.log("Order Update:", updateStreakOnOrder(currentStreak, lastOrder, now2)); // Should be 1

console.log("\nScenario 3: Same day (5 hours later)");
const now3 = new Date("2026-04-07T15:00:00Z");
currentStreak = checkStreak(streak, lastOrder, now3);
console.log("Middleware Check:", currentStreak); // Should be 5
console.log("Order Update:", updateStreakOnOrder(currentStreak, lastOrder, now3)); // Should be 5
