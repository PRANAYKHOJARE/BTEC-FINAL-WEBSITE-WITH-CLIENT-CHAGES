import { useState, useEffect } from "react";
import { X } from "lucide-react";

import railwayImg from "@/assets/pune-railway.jpg";
import railway2Img from "@/assets/pune-railway-2.jpg";
import railway3Img from "@/assets/pune-railway-3.jpg";

import joyvillaImg from "@/assets/joyvilla.jpg";
import joyvilla2Img from "@/assets/joyvilla-2.jpg";
import joyvilla3Img from "@/assets/joyvilla-3.jpg";

import wellingtonImg from "@/assets/wellington-college.jpg";
import wellington2Img from "@/assets/wellington-college-2.jpg";

import kasbametroImg from "@/assets/kasba-metro.jpg";
import kasbametro2Img from "@/assets/kasba-metro-2.jpg";

// Firebase
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Project {
  id: string | number;
  title: string;
  description: string;
  image: string[];
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: "Pune Railway Station",
    description: "Fire detection system across metro terminal",
    image: [railwayImg, railway2Img, railway3Img],
  },
  {
    id: 2,
    title: "Joyvilla Fire System",
    description:
      "Complete fire alarm system installation ensuring guest safety",
    image: [joyvillaImg, joyvilla2Img, joyvilla3Img],
  },
  {
    id: 3,
    title: "Kasba Metro Station",
    description: "Fire detection system across metro terminal",
    image: [kasbametroImg, kasbametro2Img],
  },
  {
    id: 4,
    title: "Wellington International College",
    description: "Campus-wide fire safety infrastructure deployment",
    image: [wellingtonImg, wellington2Img],
  },
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImg, setActiveImg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snap = await getDocs(collection(db, "projects"));

        const firebaseProjects: Project[] = snap.docs.map((docSnap) => {
          const data = docSnap.data();

          return {
            id: docSnap.id,
            title: data.title,
            description: data.description,
            image: data.imageUrls || [data.imageUrl],
          };
        });

        setProjects([...initialProjects, ...firebaseProjects]);
      } catch (err) {
        console.error("Error loading Firestore:", err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <section id="projects" className="py-20 bg-muted/30">
        <div className="container px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our Major Projects
            </h2>
            <p className="text-lg text-muted-foreground">
              We take pride in successfully delivering quality services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-card cursor-pointer"
                onClick={() => {
                  setSelectedProject(project);
                  setActiveImg(project.image[0]);
                }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute bottom-0 p-4 text-white bg-black/60 w-full">
                    <h3 className="font-bold">{project.title}</h3>
                    <p className="text-sm">{project.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute -top-12 right-0 text-white"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="bg-black p-6 rounded-2xl">
              <div className="w-full h-[420px] mb-6">
                <img
                  src={activeImg!}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <div className="flex justify-center gap-3 flex-wrap">
                {selectedProject.image.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setActiveImg(img)}
                    className={`w-24 h-16 object-cover rounded-md cursor-pointer border-2
                      ${
                        activeImg === img
                          ? "border-primary"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 text-white text-center">
              <h3 className="text-3xl font-bold mb-2">
                {selectedProject.title}
              </h3>
              <p className="text-lg text-white/80">
                {selectedProject.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
