export default vipInforData = (state = [], action) => {
    switch (action.type) {
      case 'VIPINFORACTION':
        return state = action.data
      default:
        return state
    }
  }