import React from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPinterest,
} from 'react-icons/fa6';

interface MenterComponentProps {
  member: {
    name: string;
    title: string;
    description: string;
    img: string;
    socials: string[];
  };
}

const MenterComponent: React.FC<MenterComponentProps> = ({ member }) => {
  return (
    <div className="text-white h-auto flex flex-col">
      <img
        src={member.img}
        alt={member.name}
        className="w-full h-96 object-cover rounded-t-lg mb-4"
      />
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl md:text-2xl font-semibold">{member.name}</h2>
        <p className="text-sm text-secondaryColor mt-1">{member.title}</p>
        <p className="text-sm text-white mt-4 line-clamp-2 flex-1">
          {member.description}
        </p>
        <div className="flex justify-start gap-4 mt-4">
          {member.socials.map((social, i) => (
            <a
              key={i}
              href="#"
              className="text-gray-300 hover:text-secondaryColor transition"
            >
              {social === 'facebook' && <FaFacebook />}
              {social === 'twitter' && <FaTwitter />}
              {social === 'instagram' && <FaInstagram />}
              {social === 'pinterest' && <FaPinterest />}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenterComponent;
