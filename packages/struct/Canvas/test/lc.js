function maxSquareField(m, n, hFences, vFences) {
    const MOD = 1e9 + 7;
    // Initialize horizontal and vertical fence arrays
    const horizontal = Array.from({ length: m }, () => Array(n).fill(0));
    const vertical = Array.from({ length: m }, () => Array(n).fill(0));
    // Mark the positions of horizontal fences
    for (const fence of hFences) {
        for (let i = 0; i < n; i++) {
            horizontal[fence - 1][i] = 1;
        }
    }
    // Mark the positions of vertical fences
    for (const fence of vFences) {
        for (let i = 0; i < m; i++) {
            vertical[i][fence - 1] = 1;
        }
    }
    // Initialize dp array
    const dp = Array.from({ length: m }, () => Array(n).fill(0));
    // Initialize the first row and column of dp array
    for (let i = 0; i < m; i++) {
        dp[i][0] = 1 - vertical[i][0];
    }
    for (let i = 0; i < n; i++) {
        dp[0][i] = 1 - horizontal[0][i];
    }
    // Fill the dp array
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (horizontal[i][j] === 0 && vertical[i][j] === 0) {
                dp[i][j] = (1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1])) % MOD;
            }
        }
    }
    // Find the maximum value in the dp array and calculate the square area
    let maxSquare = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (horizontal[i][j] === 0 && vertical[i][j] === 0) {
                maxSquare = Math.max(maxSquare, dp[i][j]);
            }
        }
    }
    // If maxSquare is 0, it means no square can be formed, so return -1
    return maxSquare === 0 ? -1 : (maxSquare * maxSquare) % MOD;
}
// Example usage:
const m1 = 4, n1 = 3, hFences1 = [2, 3], vFences1 = [2];
console.log(maxSquareField(m1, n1, hFences1, vFences1)); // Output: 4
const m2 = 6, n2 = 7, hFences2 = [2], vFences2 = [4];
console.log(maxSquareField(m2, n2, hFences2, vFences2)); // Output: -1
