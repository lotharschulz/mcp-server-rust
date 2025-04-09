use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn factorial(num: u64) -> u64 {
    let mut result = 1;
    for i in 1..=num {
        result *= i;
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_factorial() {
        // Test base cases
        assert_eq!(factorial(0), 1); // 0! = 1
        assert_eq!(factorial(1), 1); // 1! = 1

        // Test small numbers
        assert_eq!(factorial(5), 120); // 5! = 120
        assert_eq!(factorial(6), 720); // 6! = 720

        // Test bigger numbers
        assert_eq!(factorial(10), 3_628_800); // 10! = 3,628,800
        assert_eq!(factorial(20), 2_432_902_008_176_640_000); // 20! = 2_432_902_008_176_640_000
    }
}
