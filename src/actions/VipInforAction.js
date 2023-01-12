export const getVipInforAction = () => {
  return (dispatch, getState) => {
    fetchRequest(ApiPort.VipLevel, 'GET').then((res) => {
      return dispatch({ type: "VIPINFORACTION", data: res })
    }).catch((err) => {
      console.log(err)
    })
  }
}