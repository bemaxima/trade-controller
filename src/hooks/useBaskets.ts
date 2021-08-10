import { useCallback } from "react";
import { BasketModel } from "../types/baskets";
import * as service from '../service'
import useThunkReducer from 'react-hook-thunk-reducer';
import { useInterval } from "./useInterval";
interface State {
  refreshTime: Date | null;
  baskets: BasketModel[];
}

function reducer(state: State, action: any) {
  switch (action.type) {
    case 'REFRESH':
      {
        let newBaskets = [];
        const { baskets } = state;
        if (baskets.length === 0) {
          newBaskets = action.payload.baskets.filter(x => x.success);
        }
        else {
          newBaskets = action.payload.baskets.filter(x => baskets.some(p => p.serverId === x.serverId));
        }
        return {
          ...state,
          refreshTime: action.payload.timeStamp,
          baskets: newBaskets
        }
      }
    default:
      return state;
  }
}

const refreshActionCreator = () => {
  return async (dispatch) => {
    const timeStamp = new Date();
    const baskets: BasketModel[] = await service.getBaskets();
    dispatch({ type: 'REFRESH', payload: { baskets, timeStamp } });
  }
}

export function useBaskets() {
  // const [refreshTime, setRefreshTime] = useState<Date | null>(null);
  // const [baskets, setBaskets] = useState<BasketModel[]>([]);
  const [{ refreshTime, baskets }, dispatch] = useThunkReducer(reducer, {
    baskets: [],
    refreshTime: null
  });

  // const refresh = useCallback(async function () {
  //   const timeStamp = new Date();
  //   let baskets: BasketModel[] = await service.getBaskets();
  //   console.log('setting baskets', [...baskets]);
  //   console.log('setting prev', prevBaskets);
  //   if (prevBaskets === undefined) {
  //     baskets = baskets.filter(x => x.success);
  //   }
  //   else {
  //     baskets = baskets.filter(x => prevBaskets.some(p => p.serverId === x.serverId));
  //   }

  //   ReactDOM.unstable_batchedUpdates(() => {
  //     setRefreshTime(timeStamp);
  //     setBaskets(baskets);
  //   })
  //   return baskets;
  // }, [prevBaskets]);

  
  const hasError = baskets.some(x => !x.success);
  
  
  const refresh = useCallback(() => dispatch(refreshActionCreator()), [dispatch]);
  useInterval(refresh, 20 * 1000);

  return {
    refreshTime,
    baskets,
    refresh,
    hasError
  }
}