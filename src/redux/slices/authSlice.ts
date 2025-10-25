// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Define the user type based on what .toJSON() returns
type UserJSON = ReturnType<FirebaseAuthTypes.User['toJSON']>;

interface AuthState {
  user: UserJSON | null;
  isLoading: boolean;
  error: string | null;
  requiresMFA: boolean;
  verificationId: string | null;
  mfaResolver: FirebaseAuthTypes.MultiFactorResolver | null;
  phoneNumberForMFA: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  requiresMFA: false,
  verificationId: null,
  mfaResolver: null,
  phoneNumberForMFA: null,
};

// Sign in with email and handle MFA
export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return { 
        user: userCredential.user.toJSON(), 
        requiresMFA: false,
        mfaResolver: null,
        phoneNumberForMFA: null
      };
    } catch (error: any) {
      // Check if MFA is required
      if (error.code === 'auth/multi-factor-auth-required') {
        const resolver = auth().getMultiFactorResolver(error);
        
        // Filter for phone factor hints
        const phoneHints = resolver.hints.filter(
          (hint) => hint.factorId === auth.PhoneMultiFactorGenerator.FACTOR_ID
        );
        
        if (phoneHints.length > 0) {
          // Cast to PhoneMultiFactorInfo to access phoneNumber
          const phoneHint = phoneHints[0] as FirebaseAuthTypes.PhoneMultiFactorInfo;
          const phoneNumber = phoneHint.phoneNumber || 'your registered phone';
          
          return {
            requiresMFA: true,
            mfaResolver: resolver,
            phoneNumberForMFA: phoneNumber,
            user: null
          };
        } else {
          // No phone MFA available
          return rejectWithValue('MFA required but no phone factor available');
        }
      }
      return rejectWithValue(error.message || 'Sign in failed');
    }
  }
);

// Send MFA SMS code
export const sendMFACode = createAsyncThunk(
  'auth/sendMFACode',
  async ({ 
    resolver, 
    selectedHint 
  }: { 
    resolver: FirebaseAuthTypes.MultiFactorResolver; 
    selectedHint?: FirebaseAuthTypes.MultiFactorInfo 
  }, { rejectWithValue }) => {
    try {
      const hint = selectedHint || resolver.hints[0];
      
      // Generate verification ID for SMS
      const verificationId = await auth()
        .verifyPhoneNumberWithMultiFactorInfo(hint, resolver.session);
      
      return { verificationId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send MFA code');
    }
  }
);

// Verify MFA code
export const verifyMFACode = createAsyncThunk(
  'auth/verifyMFACode',
  async ({ 
    verificationId, 
    verificationCode, 
    resolver 
  }: { 
    verificationId: string; 
    verificationCode: string; 
    resolver: FirebaseAuthTypes.MultiFactorResolver;
  }, { rejectWithValue }) => {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      
      const multiFactorAssertion = auth.PhoneMultiFactorGenerator.assertion(credential);
      const userCredential = await resolver.resolveSignIn(multiFactorAssertion);
      
      return { 
        user: userCredential.user.toJSON(), 
        requiresMFA: false 
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Invalid verification code');
    }
  }
);

// Enroll MFA for existing users
export const enrollMFA = createAsyncThunk(
  'auth/enrollMFA',
  async ({ phoneNumber }: { phoneNumber: string }, { rejectWithValue }) => {
    try {
      const user = auth().currentUser;
      if (!user) {
        return rejectWithValue('No user signed in');
      }

      const multiFactorUser = await auth().multiFactor(user);
      const session = await multiFactorUser.getSession();
      
      // Send verification code
      const verificationId = await auth()
        .verifyPhoneNumberForMultiFactor({
          phoneNumber,
          session,
        });
      
      return { verificationId, phoneNumber };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to enroll MFA');
    }
  }
);

// Complete MFA enrollment
export const confirmMFAEnrollment = createAsyncThunk(
  'auth/confirmMFAEnrollment',
  async ({ 
    verificationId, 
    verificationCode,
    displayName 
  }: { 
    verificationId: string; 
    verificationCode: string;
    displayName?: string;
  }, { rejectWithValue }) => {
    try {
      const user = auth().currentUser;
      if (!user) {
        return rejectWithValue('No user signed in');
      }

      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      
      const multiFactorAssertion = auth.PhoneMultiFactorGenerator.assertion(credential);
      const multiFactorUser = await auth().multiFactor(user);
      
      await multiFactorUser.enroll(multiFactorAssertion, displayName || 'Phone');
      
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to confirm MFA enrollment');
    }
  }
);

// Sign in with phone (for phone-only authentication)
export const signInWithPhone = createAsyncThunk(
  'auth/signInWithPhone',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      return { verificationId: confirmation.verificationId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send verification code');
    }
  }
);

// Verify phone number code (for phone-only authentication)
export const verifyPhoneCode = createAsyncThunk(
  'auth/verifyPhoneCode',
  async ({ 
    verificationId, 
    verificationCode 
  }: { 
    verificationId: string; 
    verificationCode: string;
  }, { rejectWithValue }) => {
    try {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      const userCredential = await auth().signInWithCredential(credential);
      return { user: userCredential.user.toJSON() };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Invalid verification code');
    }
  }
);

// Clear error
export const clearError = createAsyncThunk('auth/clearError', async () => {
  return null;
});

// Check authentication state
export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async () => {
    return new Promise<{ user: UserJSON | null }>((resolve) => {
      const unsubscribe = auth().onAuthStateChanged((user) => {
        unsubscribe();
        if (user) {
          resolve({ user: user.toJSON() });
        } else {
          resolve({ user: null });
        }
      });
    });
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMFAState: (state) => {
      state.requiresMFA = false;
      state.verificationId = null;
      state.mfaResolver = null;
      state.phoneNumberForMFA = null;
    },
    signOut: () => {
      auth().signOut();
      return initialState;
    },
    setUser: (state, action: PayloadAction<UserJSON | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign in with email
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.requiresMFA) {
          state.requiresMFA = true;
          state.mfaResolver = action.payload.mfaResolver;
          state.phoneNumberForMFA = action.payload.phoneNumberForMFA;
          state.user = null;
        } else {
          state.user = action.payload.user;
          state.requiresMFA = false;
          state.mfaResolver = null;
          state.phoneNumberForMFA = null;
        }
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Send MFA code
      .addCase(sendMFACode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMFACode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationId = action.payload.verificationId;
      })
      .addCase(sendMFACode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Verify MFA code
      .addCase(verifyMFACode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyMFACode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.requiresMFA = false;
        state.mfaResolver = null;
        state.verificationId = null;
        state.phoneNumberForMFA = null;
      })
      .addCase(verifyMFACode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Sign in with phone
      .addCase(signInWithPhone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithPhone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationId = action.payload.verificationId;
      })
      .addCase(signInWithPhone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Verify phone code
      .addCase(verifyPhoneCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhoneCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.verificationId = null;
      })
      .addCase(verifyPhoneCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Enroll MFA
      .addCase(enrollMFA.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enrollMFA.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationId = action.payload.verificationId;
      })
      .addCase(enrollMFA.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Confirm MFA enrollment
      .addCase(confirmMFAEnrollment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmMFAEnrollment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(confirmMFAEnrollment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Check auth state
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
      })
      
      // Clear error
      .addCase(clearError.fulfilled, (state) => {
        state.error = null;
      });
  },
});

export const { clearMFAState, signOut, setUser } = authSlice.actions;
export default authSlice.reducer;