export default function swapPositions(data, id1, id2) {
  const tempData = data
  const item1 = tempData.find(item => item.id === id1)
  const item2 = tempData.find(item => item.id === id2)

  if (item1 && item2) {
    // Swap the position values
    [item1.position, item2.position] = [item2.position, item1.position]
    
    return {
      list: tempData,
      positions: [
        { id: item1.id, position: item1.position },
        { id: item2.id, position: item2.position }
      ]
    }
  }
}