// Typed selector whenever we want to access any state inside our redux store
// Given type <RootState> Typescript will understand the type of data stored
// inside our redux store

import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../redux';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
