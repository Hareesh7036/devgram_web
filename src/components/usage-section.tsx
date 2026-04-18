const UsageSection = () => {
  const steps = [
    {
      title: "Discover & Connect",
      description: "Browse the feed and send 'Interested' requests to developers who match your interests.",
      icon: "fas fa-search"
    },
    {
      title: "Manage Requests",
      description: "Head to the 'Requests' tab in your profile menu to see who wants to connect with you.",
      icon: "fas fa-user-plus"
    },
    {
      title: "Your Network",
      description: "Once connected, find all your professional links in the 'Connections' tab.",
      icon: "fas fa-network-wired"
    },
    {
      title: "Showcase Yourself",
      description: "Use the 'Profile' option to update your skills, age, and bio to attract better matches.",
      icon: "fas fa-user-edit"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 animate-fadeIn">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Mastering DevGram
        </h2>
        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
        <p className="text-xl opacity-70 max-w-2xl mx-auto">
          Explore your professional network with ease. Here's how to navigate your profile options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 border border-base-300 group overflow-hidden"
          >
            <div className="card-body items-center text-center p-8 relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl group-hover:scale-110 transition-transform duration-500">
                0{index + 1}
              </div>
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors duration-300 rotate-3 group-hover:rotate-0 transition-transform">
                <i className={`${step.icon} text-4xl text-primary`}></i>
              </div>
              <h3 className="card-title text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-base opacity-80 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-base-200 border border-base-300">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-crown text-warning"></i> Go Premium
          </h3>
          <p className="opacity-80 mb-4">
            Unlock the <strong>Premium</strong> tab to access exclusive features like unlimited requests and direct messaging capabilities.
          </p>
          <div className="badge badge-warning badge-outline">Highly Recommended</div>
        </div>
        <div className="p-8 rounded-3xl bg-base-200 border border-base-300">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-sign-out-alt"></i> Safety First
          </h3>
          <p className="opacity-80 mb-4">
            Always remember to <strong>Logout</strong> when using public devices to keep your developer network secure.
          </p>
          <div className="badge badge-info badge-outline">Best Practice</div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm opacity-50 italic">
          Tip: You can access all these options by clicking on your profile avatar in the top right corner!
        </p>
      </div>
    </div>
  );
};

export default UsageSection;
