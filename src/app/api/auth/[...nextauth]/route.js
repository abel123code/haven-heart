import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google';

import bcrypt from "bcryptjs";
import connectToDB from "@/lib/mongodb";
import User from "../../../../../models/User";
//everytime ur callback function is called, ensure you connect to db first. that is the first step

export const authOptions = ({
    providers: [
      GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialsProvider({
      name: "Credentials",
      credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
          await connectToDB();

          // 1) Find user by email
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
          throw new Error("No user found.");
          }

          // 2) Check if user is verified
          if (!user.isVerified) {
          throw new Error("Please verify your email before logging in.");
          }

          // 3) Check password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
          throw new Error("Invalid credentials.");
          }

          // 4) Return user object (NextAuth will store in JWT)
          return { 
            id: user._id.toString(),
            email: user.email,
            name: user.username || user.email,
            image: user.image || null
          };
      },
      }),
  ],
  // Use JWT-based sessions (no separate session collection needed)
  session: { 
      maxAge: 60 * 60 ,
      strategy: "jwt" 
  },
  // You can customize JWT and session callbacks if needed
  callbacks: {
      async jwt({ token, user }) {
        // console.log('jwt callback called...........')
        // console.log('jwt called with: ', { token, user });
        // If user exists (on sign-in), fetch `firstTimeLogin` from the database
        await connectToDB();
        if (user) {
          // Initial sign-in
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.firstTimeLogin = dbUser.firstTimeLogin;
            token.role = dbUser.role;
          }
        } else if (token.email) {
          // Subsequent sessions: Fetch latest firstTimeLogin
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.firstTimeLogin = dbUser.firstTimeLogin;
            token.role = dbUser.role;
          }
        }

        
    
        return token; // Return the updated token
      },
      async session({ session }) {
        await connectToDB();
        const user = await User.findOne({ email: session.user.email });
        if (user) {
          session.user.id = user._id.toString();
          session.user.username = user.username;
          session.user.firstTimeLogin = user.firstTimeLogin; 
          session.user.role = user.role;
        }
        return session;
      },   
      async signIn({ user, account, profile }) {
        await connectToDB();
        // console.log('signIn callback called...........')
        // console.log('Sign in with:', { user, account, profile });
    
        if (account.provider === "google") {
          // Handle Google Sign-In
          const existingUser = await User.findOne({ email: profile.email });
    
          if (existingUser) {
            let needsUpdate = false;
    
            // Ensure `isVerified` is set to true
            if (!existingUser.isVerified) {
              existingUser.isVerified = true;
              needsUpdate = true;
            }
    
            // Ensure Google ID is linked
            if (!existingUser.googleId) {
              existingUser.googleId = profile.sub;
              needsUpdate = true;
            }

            // Ensure preferences have the correct structure
            if (
              !existingUser.preferences ||
              !Array.isArray(existingUser.preferences.focusAreas) ||
              !Array.isArray(existingUser.preferences.challenges) ||
              typeof existingUser.preferences.supportPreference !== "string" ||
              !Array.isArray(existingUser.preferences.eventInterests)
            ) {
              existingUser.preferences = {
                focusAreas: existingUser.preferences?.focusAreas || [],
                challenges: existingUser.preferences?.challenges || [],
                supportPreference: existingUser.preferences?.supportPreference || "",
                eventInterests: existingUser.preferences?.eventInterests || [],
              };
              needsUpdate = true;
            }
  
    
            // Save changes if updates are made
            if (needsUpdate) {
              await existingUser.save();
            }
          } else {
            // Create a new user if one doesn't exist
            console.log('creating a new user.........')
            const baseUsername = profile.email.split("@")[0].toLowerCase();
            let finalUsername = baseUsername;
            let count = 1;
            while (await User.findOne({ username: finalUsername })) {
              finalUsername = `${baseUsername}${count}`;
              count++;
            }
            
            await User.create({
              email: profile.email,
              username: finalUsername,
              image: profile.picture || "",
              googleId: profile.sub,
              isVerified: true,
              role: "user",
              firstTimeLogin: true, // Ensure firstTimeLogin is set for new Google users
              preferences: {
                focusAreas: [],
                challenges: [],
                supportPreference: "",
                eventInterests: [],
              },
            });
          }
          return true;
        } else if (account.provider === "credentials") {
          // Credentials sign-in is handled in `authorize`
          return true;
        }
        return false;
      },
  },

  secret: process.env.NEXTAUTH_SECRET, // used to sign JWT
});

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
