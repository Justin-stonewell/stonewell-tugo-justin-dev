import * as type from '../types';

const initialState = {
  result: [], //all result
  travelQuotes: [], //get data
  loading: false,
  error: null,
  sendEmailResult: [],
  sendEmailLoading: false,
  sendEmailError: null,  
  updatedTravelQuoteOver60: [],
  UpdatedLoading: false,
  UpdatedError: null,
}

export default function travelQuotesOver60Reducer(state = initialState, action) {
  switch(action.type) {
        case type.POST_TRAVEL_QUOTE_OVER_60_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.POST_TRAVEL_QUOTE_OVER_60_SUCCESS: 
        return {
          ...state,
          loading: false,
          result: action.result
        }
      case type.POST_TRAVEL_QUOTE_OVER_60_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }     
      
      case type.GET_TRAVEL_QUOTE_OVER_60_REQUESTED: 
        return {
          ...state,
          loading: true,
        }
      case type.GET_TRAVEL_QUOTE_OVER_60_SUCCESS: 
        return {
          ...state,
          loading: false,
          travelQuotes: action.travelQuotes.data
        }
      case type.GET_TRAVEL_QUOTE_OVER_60_FAILED:
        return {
          ...state,
          loading: false,
          error: action.message
        }  

      case type.SEND_EMAIL_PROVIDER_REQUESTED: 
        return {
          ...state,
          sendEmailLoading: true,
        }
      case type.SEND_EMAIL_PROVIDER_SUCCESS: 
        return {
          ...state,
          sendEmailLoading: false,
          sendEmailResult: action.result
        }
      case type.SEND_EMAIL_PROVIDER_FAILED:
        return {
          ...state,
          sendEmailLoading: false,
          sendEmailError: action.message
        } 

      // Put (update status) 
      case type.PUT_TRAVEL_QUOTE_OVER_60_REQUESTED: 
          return {
            ...state,
            UpdatedLoading: true,
          }
        case type.PUT_TRAVEL_QUOTE_OVER_60_SUCCESS: 
          return {
            ...state,
            UpdatedLoading: false,
            updatedTravelQuoteOver60: action.result
          }
        case type.PUT_TRAVEL_QUOTE_OVER_60_FAILED:
          return {
            ...state,
            UpdatedLoading: false,
            UpdatedError: action.message
          }   

    default:
      return state;
  }
}
