import numbro from "numbro"

export default defineNuxtPlugin(() => {
  const formatNumber = (num) => {
    return numbro(num).format({
      average: true, // Enables K, M, B notation
      mantissa: 2,   // Always show 2 decimal places
      trimMantissa: true, // Remove trailing zeros (e.g., 1.00K → 1K)
    })
  }

  return {
    provide: {
      formatNumber,
    },
  }
})