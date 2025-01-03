import React from "react";

interface FeatureItemProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  backgroundImage: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  title,
  subtitle,
  buttonText = "DISCOVER MENU",
  backgroundImage,
}) => {
  return (
    <div
      className="relative bg-cover bg-center group h-full"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-headerBackground group-hover:bg-opacity-70 transition-all duration-500 ease-in-out transform scale-y-0 group-hover:scale-y-100 origin-bottom"></div>

      <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white text-left px-4 py-6">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-restora font-semibold transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
          {title}
        </h2>

        <p className="text-xs md:text-sm mt-2 uppercase tracking-wide transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
          {subtitle}
        </p>

        {buttonText && (
          <button className="font-semibold font-sans text-xs mt-6 px-6 md:px-8 py-2 md:py-3 border border-secondaryColor hover:bg-secondaryColor hover:text-black opacity-0 group-hover:opacity-100 transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 ease-in-out">
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const features = [
    {
      title: "Have a Drink",
      subtitle: "Wine List",
      backgroundImage: "/assets/images/home/discover1.jpg",
    },
    {
      title: "Our Chef’s Secrets",
      subtitle: "Recipes",
      backgroundImage: "/assets/images/home/discover2.jpg",
    },
    {
      title: "New Tasting Menus",
      subtitle: "Recommendations",
      backgroundImage: "/assets/images/home/discover3.jpg",
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grib-cols-2 lg:grid-cols-3 h-auto md:h-[450px]">
      {features.map((feature, index) => (
        <div key={index} className="h-[300px] md:h-full">
          <FeatureItem
            title={feature.title}
            subtitle={feature.subtitle}
            backgroundImage={feature.backgroundImage}
          />
        </div>
      ))}
    </section>
  );
};

export default FeatureSection;