export const ACTION_MAINTAINSTATUS_UPDATE = 'ACTION_MAINTAINSTATUS_UPDATE';

//BTI維護
export const ACTION_MaintainStatus_SetBTI = (isMaintenance = false) => {
  const action = {
    type: ACTION_MAINTAINSTATUS_UPDATE,
    payload: {
      isBTI : isMaintenance,
    },
  };

  return action;
}

//IM維護
export const ACTION_MaintainStatus_SetIM = (isMaintenance = false) => {
  const action = {
    type: ACTION_MAINTAINSTATUS_UPDATE,
    payload: {
      isIM : isMaintenance,
    },
  };

  return action;
}

//OW維護
export const ACTION_MaintainStatus_SetOW = (isMaintenance = false) => {
  const action = {
    type: ACTION_MAINTAINSTATUS_UPDATE,
    payload: {
      isOW : isMaintenance,
    },
  };

  return action;
}

//BTI無法獲取token
export const ACTION_MaintainStatus_NoTokenBTI = (isNoToken = false) => {
  const action = {
    type: ACTION_MAINTAINSTATUS_UPDATE,
    payload: {
      noTokenBTI : isNoToken,
    },
  };

  return action;
}

//IM無法獲取token
export const ACTION_MaintainStatus_NoTokenIM = (isNoToken = false) => {
  const action = {
    type: ACTION_MAINTAINSTATUS_UPDATE,
    payload: {
      noTokenIM : isNoToken,
    },
  };

  return action;
}

//OW無法獲取token
export const ACTION_MaintainStatus_NoTokenOW = (isNoToken = false) => {
  const action = {
    type: ACTION_MAINTAINSTATUS_UPDATE,
    payload: {
      noTokenOW : isNoToken,
    },
  };

  return action;
}

//登出時重置 狀態
export const ACTION_MaintainStatus_Logout = () => {
  const action = {
    type: ACTION_MAINTAINSTATUS_UPDATE,
    payload: {
      noTokenBTI: false,
      noTokenIM: false,
      noTokenOW: false,
    },
  };

  return action;
}
