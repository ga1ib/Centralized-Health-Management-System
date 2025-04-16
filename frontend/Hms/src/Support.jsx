import React from "react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import Header from "./header";
import Footer from "./footer";

const contributors = [
  {
    name: "Muhaiminur Islam Rudro",
    role: "Front-End Developer",
    bio: "A creative developer passionate about building engaging, user-friendly interfaces.",
    image: "../image/rudro.jpg",
    social: {
      linkedin: "https://www.linkedin.com/in/muhaiminur-rahman-rudro-012709276/",
      github: "http://github.com/Muhaiminur-Rahman-Rudro",
      twitter: "https://twitter.com/muhaiminurrudra",
    },
  },
  {
    name: "Md. Kamrul Islam",
    role: "Back-End Developer",
    bio: "Specializes in robust server-side solutions and efficient database designs.",
    image: "../image/kamrul.jpg",
    social: {
      linkedin: "https://www.linkedin.com/in/iamkamrulislam/",
      github: "https://github.com/md-kamrul",
      twitter: "https://twitter.com/kamrulislam",
    },
  },
  {
    name: "Abdur Rahman Galib",
    role: "Full-Stack Developer",
    bio: "Bridges creative UI with solid back-end logic to ensure seamless experiences.",
    image: "../image/galib.JPG",
    social: {
      linkedin: "https://www.linkedin.com/in/abdur-rahman-07411921a/",
      github: "https://github.com/ga1ib",
      twitter: "https://twitter.com/abdurrahmangalib",
    },
  },
];

const instructor = {
  name: "Mr. AKM Iqtidar Newaz",
  role: "Project Instructor",
  bio: "A dedicated mentor ensuring academic and industry excellence throughout the project.",
  image: "../image/AKM-Iqtidar-Newaz.jpg",
  social: {
    linkedin: "https://www.linkedin.com/in/akm-iqtidar-newaz-255b57137/",
    github: "#",
    twitter: "#",
  },
};

const Support = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 w-full z-50">
        <Header />
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 pt-24">
        <div className="container mx-auto py-20 px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Meet Our Team</h1>
          <p className="text-lg md:text-xl">
            The creative minds behind the Centralized Hospital Management System
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">

        {/* Instructor Section FIRST */}
        <section className="mb-16">
          <h2 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Instructor</h2>
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center hover:shadow-xl transition transform hover:scale-105">
              <img
                src={instructor.image}
                alt={instructor.name}
                className="w-32 h-32 rounded-full border-4 border-purple-600 mb-6 mx-auto"
              />
              <h3 className="text-2xl font-semibold text-gray-800">{instructor.name}</h3>
              <p className="text-sm text-purple-600 uppercase mb-2">{instructor.role}</p>
              <p className="text-gray-600 mb-4">{instructor.bio}</p>
              <div className="flex justify-center gap-4">
                <a
                  href={instructor.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <FaLinkedin size={22} />
                </a>
                {instructor.social.github !== "#" && (
                  <a
                    href={instructor.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-gray-900"
                  >
                    <FaGithub size={22} />
                  </a>
                )}
                {instructor.social.twitter !== "#" && (
                  <a
                    href={instructor.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaTwitter size={22} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contributors Section SECOND */}
        <section>
          <h2 className="text-4xl font-semibold text-gray-800 mb-8 text-center">Contributors</h2>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {contributors.map((person, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition transform hover:scale-105"
              >
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-32 h-32 rounded-full border-4 border-indigo-600 mb-6 mx-auto"
                />
                <h3 className="text-2xl font-semibold text-gray-800">{person.name}</h3>
                <p className="text-sm text-indigo-600 uppercase mb-2">{person.role}</p>
                <p className="text-gray-600 mb-4">{person.bio}</p>
                <div className="flex justify-center gap-4">
                  <a
                    href={person.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <FaLinkedin size={22} />
                  </a>
                  <a
                    href={person.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-gray-900"
                  >
                    <FaGithub size={22} />
                  </a>
                  <a
                    href={person.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaTwitter size={22} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
