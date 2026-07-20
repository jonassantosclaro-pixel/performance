import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { Solution, Program, Testimonial, Review } from "../types";
import { SOLUTIONS, PROGRAMS, TESTIMONIALS, REVIEWS_DATA } from "../data";


export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyDngF2REduV_dtx4s3ooG1XX-hDH6U9-Cs",
  authDomain: "gen-lang-client-0764078049.firebaseapp.com",
  projectId: "gen-lang-client-0764078049",
  storageBucket: "gen-lang-client-0764078049.firebasestorage.app",
  messagingSenderId: "774726434975",
  appId: "1:774726434975:web:a8b327afb3e2ca3ddee2aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with named database ID
export const db = getFirestore(app, "ai-studio-79f458aa-931d-46be-a709-f21a4ef7a8d8");

// Initialize Auth
export const auth = getAuth(app);

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Default configuration settings
export interface GlobalSettings {
  instagram: string;
  whatsapp: string;
  email: string;
  views: number;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCta?: string;
  statsColaboradores?: number;
  statsEventos?: number;
  statsEmpresas?: number;
  statsAprovacao?: number;
}

const DEFAULT_SETTINGS: GlobalSettings = {
  instagram: "https://instagram.com/performance.treinamentos",
  whatsapp: "+5511999999999",
  email: "contato@performance.com",
  views: 0,
  heroTitle: "Experiências que Transformam Equipes e Empresas.",
  heroSubtitle: "Palestras shows, teatro corporativo, ginástica laboral, ergonomia e atividades interativas. Soluções inovadoras para promover a segurança do trabalho, saúde física e bem-estar mental de seus colaboradores.",
  heroCta: "Ver Programas",
  statsColaboradores: 450000,
  statsEventos: 2500,
  statsEmpresas: 850,
  statsAprovacao: 98
};

/**
 * Bootstraps or retrieves the global configuration.
 * Increments the page views counter in a secure, isolated manner.
 */
export async function bootstrapAndTrackViews(onSettingsChange: (settings: GlobalSettings) => void) {
  const globalDocRef = doc(db, "settings", "global");

  try {
    const docSnap = await getDoc(globalDocRef);
    if (!docSnap.exists()) {
      // Document does not exist, public can create it with views = 1
      const initialSettings = { ...DEFAULT_SETTINGS, views: 1 };
      await setDoc(globalDocRef, initialSettings);
      onSettingsChange(initialSettings);
    } else {
      // Document exists, increment views by 1
      const currentData = docSnap.data() as GlobalSettings;
      // Ensure any missing settings fields are patched from defaults
      const updatedData: any = {
        views: increment(1)
      };
      
      // Patch missing fields lazily
      let hasMissing = false;
      const keysToCheck = [
        "heroTitle", "heroSubtitle", "heroCta", 
        "statsColaboradores", "statsEventos", "statsEmpresas", "statsAprovacao"
      ] as const;
      
      for (const key of keysToCheck) {
        if (currentData[key] === undefined) {
          updatedData[key] = DEFAULT_SETTINGS[key];
          hasMissing = true;
        }
      }
      
      if (hasMissing) {
        await updateDoc(globalDocRef, updatedData);
      } else {
        await updateDoc(globalDocRef, { views: increment(1) as any });
      }
    }
  } catch (error) {
    console.error("Error bootstrapping or tracking views:", error);
  }

  // Set up real-time listener for settings
  return onSnapshot(globalDocRef, (docSnap) => {
    if (docSnap.exists()) {
      onSettingsChange(docSnap.data() as GlobalSettings);
    }
  });
}

/**
 * Submits a contact message / lead
 */
export async function submitLead(name: string, email: string, phone: string, company: string, message: string) {
  const leadsRef = collection(db, "leads");
  const randomId = Math.random().toString(36).substring(2, 15);
  const leadDocRef = doc(db, "leads", randomId);
  
  await setDoc(leadDocRef, {
    name,
    email,
    phone: phone || "",
    company: company || "",
    message,
    createdAt: new Date().toISOString()
  });
}

/**
 * Handles admin authentication.
 * If user does not exist, registers them automatically with hardcoded admin credentials.
 */
export async function authenticateAdmin(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    // If user not found, or invalid-credential, check if it's the target admin and auto-register
    if (email === "performance@x.com" && password === "performance4321") {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (signUpError) {
        throw error;
      }
    }
    throw error;
  }
}

/**
 * Signs out the current admin
 */
export async function signAdminOut() {
  await signOut(auth);
}

/**
 * Listens for Auth state changes
 */
export function listenToAuthState(onStateChanged: (user: User | null) => void) {
  return onAuthStateChanged(auth, onStateChanged);
}

/**
 * Saves edited settings to Firestore (admin-only)
 */
export async function saveGlobalSettings(settings: Partial<GlobalSettings>) {
  const globalDocRef = doc(db, "settings", "global");
  await updateDoc(globalDocRef, settings);
}

// SOLUTIONS REAL-TIME & CRUD
export function listenToSolutions(onSolutionsChange: (solutions: Solution[]) => void) {
  const colRef = collection(db, "solutions");
  
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log("Seeding solutions collection with defaults...");
        for (const sol of SOLUTIONS) {
          const docRef = doc(db, "solutions", sol.id);
          await setDoc(docRef, {
            title: sol.title,
            icon: sol.icon,
            shortDesc: sol.shortDesc,
            longDesc: sol.longDesc,
            category: sol.category,
            benefits: sol.benefits
          }).catch(err => console.error("Error seeding solution:", err));
        }
        return;
      }
      
      const solutions: Solution[] = [];
      snapshot.forEach((doc) => {
        solutions.push({ id: doc.id, ...doc.data() } as Solution);
      });
      onSolutionsChange(solutions);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, "solutions");
    }
  );
}

export async function saveSolution(solution: Omit<Solution, "id"> & { id?: string }) {
  const id = solution.id || "sol_" + Math.random().toString(36).substring(2, 15);
  const docRef = doc(db, "solutions", id);
  const payload = {
    title: solution.title,
    icon: solution.icon,
    shortDesc: solution.shortDesc,
    longDesc: solution.longDesc,
    category: solution.category,
    benefits: solution.benefits
  };
  try {
    await setDoc(docRef, payload);
    return { id, ...payload };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `solutions/${id}`);
  }
}

export async function deleteSolution(solutionId: string) {
  const docRef = doc(db, "solutions", solutionId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `solutions/${solutionId}`);
  }
}

// PROGRAMS REAL-TIME & CRUD
export function listenToPrograms(onProgramsChange: (programs: Program[]) => void) {
  const colRef = collection(db, "programs");
  
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log("Seeding programs collection with defaults...");
        for (const prog of PROGRAMS) {
          const docRef = doc(db, "programs", prog.id);
          await setDoc(docRef, {
            title: prog.title,
            description: prog.description,
            target: prog.target,
            period: prog.period,
            color: prog.color,
            tagline: prog.tagline
          }).catch(err => console.error("Error seeding program:", err));
        }
        return;
      }
      
      const programs: Program[] = [];
      snapshot.forEach((doc) => {
        programs.push({ id: doc.id, ...doc.data() } as Program);
      });
      onProgramsChange(programs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, "programs");
    }
  );
}

export async function saveProgram(program: Omit<Program, "id"> & { id?: string }) {
  const id = program.id || "prog_" + Math.random().toString(36).substring(2, 15);
  const docRef = doc(db, "programs", id);
  const payload = {
    title: program.title,
    description: program.description,
    target: program.target,
    period: program.period,
    color: program.color,
    tagline: program.tagline
  };
  try {
    await setDoc(docRef, payload);
    return { id, ...payload };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `programs/${id}`);
  }
}

export async function deleteProgram(programId: string) {
  const docRef = doc(db, "programs", programId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `programs/${programId}`);
  }
}

// TESTIMONIALS REAL-TIME & CRUD
export function listenToTestimonials(onTestimonialsChange: (testimonials: Testimonial[]) => void) {
  const colRef = collection(db, "testimonials");
  
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log("Seeding testimonials collection with defaults...");
        for (const test of TESTIMONIALS) {
          const docRef = doc(db, "testimonials", test.id);
          await setDoc(docRef, {
            name: test.name,
            role: test.role,
            company: test.company,
            text: test.text,
            rating: test.rating
          }).catch(err => console.error("Error seeding testimonial:", err));
        }
        return;
      }
      
      const testimonials: Testimonial[] = [];
      snapshot.forEach((doc) => {
        testimonials.push({ id: doc.id, ...doc.data() } as Testimonial);
      });
      onTestimonialsChange(testimonials);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, "testimonials");
    }
  );
}

export async function saveTestimonial(testimonial: Omit<Testimonial, "id"> & { id?: string }) {
  const id = testimonial.id || "test_" + Math.random().toString(36).substring(2, 15);
  const docRef = doc(db, "testimonials", id);
  const payload = {
    name: testimonial.name,
    role: testimonial.role,
    company: testimonial.company,
    text: testimonial.text,
    rating: Number(testimonial.rating)
  };
  try {
    await setDoc(docRef, payload);
    return { id, ...payload };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `testimonials/${id}`);
  }
}

export async function deleteTestimonial(testimonialId: string) {
  const docRef = doc(db, "testimonials", testimonialId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `testimonials/${testimonialId}`);
  }
}

// GOOGLE REVIEWS REAL-TIME & CRUD (MAPPED TO REVIEWS COLLECTION)
export function listenToReviews(onReviewsChange: (reviews: Review[]) => void) {
  const colRef = collection(db, "reviews");
  
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log("Seeding reviews collection with defaults...");
        for (const rev of REVIEWS_DATA) {
          const docRef = doc(db, "reviews", rev.id);
          await setDoc(docRef, {
            name: rev.name,
            role: rev.role,
            company: rev.company,
            rating: rev.rating,
            text: rev.text,
            date: rev.date,
            avatarBg: rev.avatarBg
          }).catch(err => console.error("Error seeding review:", err));
        }
        return;
      }
      
      const reviews: Review[] = [];
      snapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() } as Review);
      });
      onReviewsChange(reviews);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, "reviews");
    }
  );
}

export async function saveReview(review: Omit<Review, "id"> & { id?: string }) {
  const id = review.id || "rev_" + Math.random().toString(36).substring(2, 15);
  const docRef = doc(db, "reviews", id);
  const payload = {
    name: review.name,
    role: review.role,
    company: review.company,
    rating: Number(review.rating),
    text: review.text,
    date: review.date || "Há 1 dia",
    avatarBg: review.avatarBg || "bg-sky-600"
  };
  try {
    await setDoc(docRef, payload);
    return { id, ...payload };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `reviews/${id}`);
  }
}

export async function deleteReview(reviewId: string) {
  const docRef = doc(db, "reviews", reviewId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `reviews/${reviewId}`);
  }
}

// BLOG INTERFACES AND CRUD
export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  category: string;
  author: string;
  createdAt: string;
}

/**
 * Saves a blog post (create or update)
 */
export async function saveBlogPost(post: Omit<BlogPost, "id"> & { id?: string }) {
  const postId = post.id || "post_" + Math.random().toString(36).substring(2, 15);
  const postDocRef = doc(db, "posts", postId);
  
  const payload = {
    title: post.title,
    content: post.content,
    summary: post.summary,
    imageUrl: post.imageUrl,
    category: post.category,
    author: post.author,
    createdAt: post.createdAt || new Date().toISOString()
  };

  try {
    await setDoc(postDocRef, payload);
    return { id: postId, ...payload };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `posts/${postId}`);
  }
}

/**
 * Deletes a blog post by ID
 */
export async function deleteBlogPost(postId: string) {
  const postDocRef = doc(db, "posts", postId);
  try {
    await deleteDoc(postDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `posts/${postId}`);
  }
}

/**
 * Listens to all blog posts in real-time, sorted by date (newest first)
 */
export function listenToBlogPosts(onPostsChange: (posts: BlogPost[]) => void) {
  const postsCollectionRef = collection(db, "posts");
  const postsQuery = query(postsCollectionRef, orderBy("createdAt", "desc"));
  
  return onSnapshot(
    postsQuery,
    (snapshot) => {
      const posts: BlogPost[] = [];
      snapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      onPostsChange(posts);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, "posts");
    }
  );
}

