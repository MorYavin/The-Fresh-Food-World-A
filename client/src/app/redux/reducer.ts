import { AppState } from './app-state';
import { Action } from './action';
import { ActionType } from './action-type';

export class Reducer {

public static reduce(oldAppState: AppState, action: Action): AppState {

    const newAppState = { ...oldAppState };

    switch (action.type) {

        case ActionType.userLogin:
            newAppState.user = action.payload;
            newAppState.isLoggedIn = true;
            sessionStorage.setItem("user", JSON.stringify(newAppState.user));
            break;

        case ActionType.updateUserStatus:
            newAppState.isLoggedIn = action.payload;
            break;

        case ActionType.updateCartStatus:
            newAppState.cartStatus = action.payload;
            break;

        case ActionType.updateDateCreated:
            newAppState.dateCreated = action.payload;
            break;
            
        case ActionType.getAllProductsInCart:
            newAppState.ItemsInCart = action.payload;
            break;

        case ActionType.addProductToCart:
            newAppState.ItemsInCart.push(action.payload);
            break;

        case ActionType.removeFromCart:
            const indexToDelete = newAppState.ItemsInCart.findIndex(p => p._id === action.payload);
            newAppState.ItemsInCart.splice(indexToDelete, 1);
            break;

        case ActionType.updateProduct:
            const index = newAppState.ItemsInCart.findIndex(p => p._id === action.payload._id);
            newAppState.ItemsInCart[index] = action.payload;
            break;

        case ActionType.updateTotalCartValue:
            newAppState.totalCartValue = action.payload;
            break;

             case ActionType.logout:
                newAppState.isLoggedIn = false;
                newAppState.user = null;
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("isUserLoggedIn");
                sessionStorage.removeItem("role");
                break;
    }
    return newAppState;
}
}