import React from 'react';
import './styles.scss';

const LandingPage = () => {
    
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_ENDPOINT}/auth/google/login-redirect`;
  };

  return (
    <div className="font-sans text-secondaryColor bg-white min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
           {/* Logo placeholder */}
           <div className="flex items-center gap-2">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <rect x="2" y="2" width="28" height="28" rx="8" fill="black"/>
                     <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-bold text-lg tracking-tight">MeetingAssist.ai</span>
           </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-black transition-colors">Features</a>
            <a href="#" className="hover:text-black transition-colors">Integrations</a>
            <a href="#" className="hover:text-black transition-colors">Security</a>
            <a href="#" className="hover:text-black transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium hover:text-black hidden sm:block">Request Demo</a>
            <button onClick={handleGoogleLogin} className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl">Start for Free</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center pt-20 pb-16 px-4 max-w-6xl mx-auto overflow-hidden">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 tracking-tight">
              Transcribe, Summarize, <br /> & Share in Seconds
          </h1>
          <p className="text-gray-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Automate your meeting notes with AI-powered ASR. Get accurate transcripts, smart summaries, and instant email reports.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
              <button onClick={handleGoogleLogin} className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition shadow-lg">Start Recording Now</button>
              <button className="bg-white text-black border border-gray-200 px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition">View Sample Summary</button>
          </div>
          
          {/* Hero Image Mockup Area */}
          <div className="relative mx-auto max-w-4xl">
             <div className="relative z-10 mx-auto w-[800px] h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
                 {/* Browser/App Header */}
                 <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-red-400"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                         <div className="w-3 h-3 rounded-full bg-green-400"></div>
                     </div>
                     <div className="text-xs text-gray-400 font-mono">Weekly Team Sync - Summary</div>
                     <div className="w-4"></div>
                 </div>
                 {/* App Content */}
                 <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 bg-gray-50 border-r border-gray-100 p-4 hidden md:block">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-4">Recordings</div>
                        <div className="space-y-2">
                            <div className="bg-white p-2 rounded border border-gray-200 shadow-sm text-sm font-medium border-l-4 border-l-black">Weekly Team Sync</div>
                            <div className="p-2 rounded hover:bg-gray-100 text-sm text-gray-600">Client Discovery Call</div>
                            <div className="p-2 rounded hover:bg-gray-100 text-sm text-gray-600">Product Roadmap Q3</div>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 p-8 text-left overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">Weekly Team Sync</h1>
                                <p className="text-sm text-gray-500">October 24, 2023 • 45 mins • 4 Participants</p>
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">Completed</span>
                        </div>
                        
                        <div className="mb-6">
                            <h3 className="text-سم font-bold uppercase text-gray-400 mb-2">Executive Summary</h3>
                            <p className="text-gray-700 leading-relaxed text-sm bg-blue-50 p-4 rounded-lg border border-blue-100">
                                The team discussed the Q4 launch timeline. <span className="font-bold">Sarah</span> confirmed the design assets will be ready by Friday. <span className="font-bold">Mike</span> raised concerns about the API latency, which <span className="font-bold">David</span> will investigate. Marketing campaign is set to kick off next week pending final approval.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Action Items</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <input type="checkbox" checked readOnly className="rounded text-black focus:ring-black" />
                                    <span>Design team to finalize assets (Due: Friday)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded text-black focus:ring-black" />
                                    <span>David to profile API performance endpoints</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded text-black focus:ring-black" />
                                    <span>Send marketing brief to stakeholders</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                 </div>
             </div>

             {/* Background Decoration */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 w-[150%] h-[120%] bg-gradient-to-t from-gray-50 to-transparent -z-10 rounded-[100%] pointer-events-none"></div>
             
             {/* Floating Badge */}
             <div className="absolute top-20 -right-4 bg-white p-3 rounded-xl shadow-xl animate-bounce-slow">
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div className="text-left">
                        <div className="text-xs font-bold text-gray-400">Status</div>
                        <div className="text-xs font-bold text-black">Summary sent to email</div>
                    </div>
                </div>
             </div>
          </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 border-t border-gray-100 bg-white">
          <p className="text-center text-sm font-semibold text-gray-500 mb-8 font-sans">Trusted by product teams at</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-16 px-6 opacity-50 grayscale transition-all hover:grayscale-0 items-center">
              <h3 className="text-xl font-bold text-gray-800">ACME Corp</h3>
              <h3 className="text-xl font-extrabold italic text-gray-600">GlobalTech</h3>
              <h3 className="text-xl font-semibold tracking-wider text-gray-700">NEBULA</h3>
              <h3 className="text-xl font-bold uppercase tracking-widest text-gray-800">VORTEX</h3>
              <h3 className="text-xl font-serif font-bold text-gray-600">Pinnacle</h3>
          </div>
      </section>

      {/* Feature 1 */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
              <div className="relative order-2 md:order-1">
                   <div className="bg-blue-50 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                       <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                       {/* Feature UI */}
                       <div className="bg-white rounded-2xl shadow-xl p-6 relative z-10 max-w-sm mx-auto">
                           <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-3">
                               <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                               </div>
                               <div className="font-bold text-sm">Recording in progress...</div>
                               <div className="ml-auto flex gap-1">
                                   <span className="w-1 h-4 bg-red-400 rounded-full animate-pulse"></span>
                                   <span className="w-1 h-3 bg-red-400 rounded-full animate-pulse delay-75"></span>
                                   <span className="w-1 h-5 bg-red-400 rounded-full animate-pulse delay-150"></span>
                               </div>
                           </div>
                           <div className="space-y-3">
                               <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                                   <span className="font-bold text-blue-600">Speaker 1:</span> Let's focus on the Q3 retention metrics.
                               </div>
                               <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                                   <span className="font-bold text-purple-600">Speaker 2:</span> Agreed. The churn rate decreased by 5% last month.
                               </div>
                               <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                                   <span className="font-bold">AI Note:</span> Key Stat: 5% churn reduction.
                               </div>
                           </div>
                       </div>
                   </div>
              </div>
              <div className="order-1 md:order-2 text-center md:text-left">
                  <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-xs font-bold mb-6 tracking-wide uppercase">High Accuracy</div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Capture Every Word <br/> with Precision</h2>
                  <p className="text-gray-500 text-lg leading-relaxed">
                      Our advanced ASR engine handles multiple speakers, accents, and technical jargon with industry-leading accuracy. Never miss a detail again.
                  </p>
              </div>
          </div>
      </section>

      {/* Feature 2 */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
             <div className="text-center md:text-left">
                  <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-xs font-bold mb-6 tracking-wide uppercase">Workflow Automation</div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Summarize & Email <br/> Instantly</h2>
                  <p className="text-gray-500 text-lg leading-relaxed">
                      Don't spend hours writing minutes. Our AI distills hour-long meetings into concise summaries and automatically emails them to all participants.
                  </p>
                  <ul className="mt-8 space-y-4 text-left inline-block">
                      <li className="flex items-center gap-3 text-gray-700">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Key decisions & Action items derived automatically
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          One-click sharing to Slack, Email, or Notion
                      </li>
                  </ul>
             </div>
             <div className="relative">
                  <div className="bg-purple-50 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex items-center justify-center">
                       <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
                      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative z-10">
                          <div className="flex items-center justify-center mb-6">
                              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                              </div>
                          </div>
                          <div className="text-center mb-6">
                              <h3 className="font-bold text-lg">Summary Sent!</h3>
                              <p className="text-gray-500 text-sm">Meeting notes have been emailed to:</p>
                          </div>
                          <div className="space-y-3">
                              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                  <div className="text-sm font-medium">david@company.com</div>
                              </div>
                              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                  <div className="text-sm font-medium">sarah@company.com</div>
                              </div>
                          </div>
                          <button className="w-full mt-6 bg-purple-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-purple-700 transition">View Report</button>
                      </div>
                  </div>
             </div>
          </div>
      </section>

      {/* Stats Section with Image */}
      <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <div>
                  <h2 className="text-4xl font-bold mb-6">Reclaim Your <br/> Productive Time</h2>
                  <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-medium mb-12">
                      <span className="text-yellow-400">★</span> Rated #1 Productivity Tool for Remote Teams
                  </div>

                  <div className="space-y-10">
                      <div className="flex gap-6 items-start">
                          <div className="w-1.5 h-12 bg-green-200 rounded-full mt-2"></div>
                          <div>
                              <div className="text-4xl font-bold mb-1">10+ Hours</div>
                              <div className="text-gray-400 text-sm max-w-xs">Saved per user each week on note-taking</div>
                          </div>
                      </div>
                      <div className="flex gap-6 items-start">
                          <div className="w-1.5 h-12 bg-purple-200 rounded-full mt-2"></div>
                          <div>
                              <div className="text-4xl font-bold mb-1">98%</div>
                              <div className="text-gray-400 text-sm max-w-xs">Transcription accuracy across 30+ languages</div>
                          </div>
                      </div>
                      <div className="flex gap-6 items-start">
                          <div className="w-1.5 h-12 bg-pink-200 rounded-full mt-2"></div>
                          <div>
                              <div className="text-4xl font-bold mb-1">2x</div>
                              <div className="text-gray-400 text-sm max-w-xs">Faster meeting follow-up completions</div>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="relative h-[500px] bg-gray-100 rounded-[3rem] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team Meeting" className="w-full h-full object-cover" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center w-72">
                       <div className="text-4xl font-bold mb-2">Focus</div>
                       <div className="text-gray-600">on the conversation, not the notes.</div>
                  </div>
              </div>
          </div>
      </section>

      {/* Social Media Ranking - Circular Charts */}
      <section className="py-24 text-center bg-gray-50 border-t border-gray-100">
          <div className="mb-4 text-gray-500 font-bold tracking-widest text-xs uppercase">Integrations</div>
          <h2 className="text-3xl font-bold mb-16">Works where you meet</h2>
          
          <div className="flex flex-wrap justify-center gap-16 md:gap-32">
              <div className="text-center group">
                  <div className="w-40 h-40 rounded-full border-[12px] border-white shadow-xl flex items-center justify-center relative mb-6 mx-auto bg-white hover:scale-105 transition">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Google_Meet_icon_%282020%29.svg/800px-Google_Meet_icon_%282020%29.svg.png" className="w-20 h-20" alt="Google Meet"/>
                  </div>
                  <div className="font-bold text-xl mb-1">Google Meet</div>
              </div>
              
              <div className="text-center group">
                  <div className="w-40 h-40 rounded-full border-[12px] border-white shadow-xl flex items-center justify-center relative mb-6 mx-auto bg-white hover:scale-105 transition">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Microsoft_Teams_2019_icon.svg/800px-Microsoft_Teams_2019_icon.svg.png" className="w-20 h-20" alt="Microsoft Teams"/>
                  </div>
                  <div className="font-bold text-xl mb-1">Microsoft Teams</div>
              </div>
              
               <div className="text-center group">
                  <div className="w-40 h-40 rounded-full border-[12px] border-white shadow-xl flex items-center justify-center relative mb-6 mx-auto bg-white hover:scale-105 transition">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Zoom_Communications_Logo_2022.svg/800px-Zoom_Communications_Logo_2022.svg.png" className="w-32" alt="Zoom"/>
                  </div>
                  <div className="font-bold text-xl mb-1">Zoom</div>
              </div>
          </div>
      </section>
      
       {/* Footer / Blog Section */}
       <section className="py-24 px-6 max-w-7xl mx-auto">
           <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-4">
               <h2 className="text-3xl font-bold">Latest productivity insights</h2>
               <a href="#" className="flex items-center gap-2 text-sm font-bold hover:text-purple-600 transition">
                   Read our Blog <span aria-hidden="true">&rarr;</span>
               </a>
           </div>
           <div className="grid md:grid-cols-3 gap-10">
               {[
                   { date: "OCT 25, 2023", read: "5 MIN READ", title: "How AI is Reshaping Remote Meetings", img: 4 },
                   { date: "OCT 20, 2023", read: "3 MIN READ", title: "The Art of Writing Effective Meeting Minutes", img: 5 },
                   { date: "OCT 15, 2023", read: "4 MIN READ", title: "5 Tools to Automate Your Workflow", img: 6 }
               ].map((item, idx) => (
                   <div key={idx} className="group cursor-pointer">
                       <div className="h-64 bg-gray-100 rounded-2xl mb-6 overflow-hidden relative">
                           <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition"></div>
                           <img src={`https://source.unsplash.com/random/800x600?office,meeting&sig=${item.img}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out" />
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-3 tracking-wider">
                           <span>{item.date}</span>
                           <span>•</span>
                           <span>{item.read}</span>
                       </div>
                       <h3 className="text-xl font-bold leading-tight group-hover:text-purple-600 transition">{item.title}</h3>
                       <p className="text-gray-500 mt-3 text-sm line-clamp-2">Learn more about how organizations are leveraging technology to improve communication efficiency.</p>
                       <div className="mt-4 text-sm font-bold underline decoration-2 decoration-gray-200 group-hover:decoration-purple-600 underline-offset-4 transition-all">Read Story</div>
                   </div>
               ))}
           </div>
       </section>
       
       <footer className="bg-black text-white py-12 text-center text-sm text-gray-500">
           <p>&copy; 2026 MeetingAssist.ai. All rights reserved.</p>
       </footer>
    </div>
  );
};

export default LandingPage;