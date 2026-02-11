
import { configureStore} from '@reduxjs/toolkit';
import type { Action, ThunkAction } from '@reduxjs/toolkit'
 import  authReducer  from '../features/auth/authSlice'
 import recipeReducer from '../features/recipe/recipeSlice'
import profileReducer from '../features/profile/profileSlice'
import pantryReducer from '../features/pantry/pantrySlice'

export const store = configureStore({
  reducer: {
    auth:authReducer,
   recipe:recipeReducer,
   profile:profileReducer,
   pantry:pantryReducer
   
  }
})



// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>

// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>