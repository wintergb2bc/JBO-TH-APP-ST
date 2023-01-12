//用來模擬mobile代碼，這樣vendor版本升級，可以直接覆蓋，不用修改
const HostConfig = {
  Config: {
    IMAccessCode: window.IMAccessCode,
    IMApi: window.IMApi,
    BTIAuthApiProxy: window.BTIAuthApiProxy,
    BTIApi: window.BTIApi,
    BTIAnnouncements: window.BTIAnnouncements,
    SignalRUrl: window.SignalRUrl,
    CacheApi:window.CacheApi,
    EuroCup2021LeagueIds: window.EuroCup2021LeagueIds,
    EuroCup2021FirstEventTime: window.EuroCup2021FirstEventTime,
    EuroCup2021FinalEventTime: window.EuroCup2021FinalEventTime,
  }
}

export default HostConfig;