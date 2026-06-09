import { useState } from "react";
import { Plus, Trash2, Calendar } from "lucide-react";

export function StudyScheduleGenerator() {
  const [subjects, setSubjects] = useState([{ name: "", hours: 2 }]);
  
  const addSubject = () => setSubjects([...subjects, { name: "", hours: 2 }]);
  const removeSubject = (i: number) => setSubjects(subjects.filter((_, idx) => idx !== i));

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
             <Calendar className="w-6 h-6" />
           </div>
           <div>
             <h3 className="font-bold text-slate-800 text-lg mb-1">Weekly Study Plan Matrix</h3>
             <p className="text-slate-500 leading-relaxed text-sm">Distribute your total weekly study hours across all your subjects. Use this utility to balance your academic workload evenly.</p>
           </div>
        </div>

        <div className="space-y-3">
          {subjects.map((sub, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center gap-4 bg-white px-4 py-3 border border-slate-200 rounded-2xl shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
              <input type="text" placeholder="Subject (e.g. Biology, Math)" value={sub.name} onChange={(e) => {
                const newSub = [...subjects];
                newSub[i].name = e.target.value;
                setSubjects(newSub);
              }} className="flex-1 w-full bg-transparent px-2 py-2 outline-none font-bold text-slate-800 placeholder-slate-300" />
              <div className="flex items-center gap-4 w-full sm:w-auto px-2 sm:px-0">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Hrs/Week</label>
                <input type="number" min="0" value={sub.hours} onChange={(e) => {
                  const newSub = [...subjects];
                  newSub[i].hours = parseInt(e.target.value) || 0;
                  setSubjects(newSub);
                }} className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 text-center font-mono font-medium transition-colors" />
                <button onClick={() => removeSubject(i)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addSubject} className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-500 font-bold rounded-2xl hover:bg-white hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm">
          <Plus className="w-5 h-5 inline mr-2" /> Add Subject
        </button>

        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl flex justify-between items-center mt-8 shadow-xl">
           <span className="font-bold text-slate-300">Total Study Hours / Week</span>
           <span className="text-4xl font-extrabold tracking-tighter">{subjects.reduce((a, b) => a + b.hours, 0)} <span className="text-lg text-slate-500 tracking-normal font-medium">hrs</span></span>
        </div>
      </div>
    </div>
  );
}

export function ExamCountdownTracker() {
  const [exams, setExams] = useState([{ name: "Midterm", date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10) }]);

  const addExam = () => setExams([...exams, { name: "", date: new Date().toISOString().slice(0,10) }]);
  const removeExam = (i: number) => setExams(exams.filter((_, idx)=>idx!==i));

  return (
    <div className="p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex justify-end mb-4">
          <button onClick={addExam} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 w-full md:w-auto shadow-md shadow-blue-500/20 transition-colors">
             <Plus className="w-5 h-5 inline mr-2" /> Add Exam
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam, i) => {
            const today = new Date();
            today.setHours(0,0,0,0);
            const target = new Date(exam.date);
            const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 3600 * 24));

            return (
              <div key={i} className="flex flex-col bg-white p-6 border border-slate-200 rounded-3xl shadow-sm gap-6 group hover:border-blue-300 hover:shadow-md transition-all relative">
                <button onClick={() => removeExam(i)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5"/></button>
                
                <div className="pr-10">
                  <input type="text" value={exam.name} onChange={e => {
                    const newE = [...exams]; newE[i].name = e.target.value; setExams(newE);
                  }} placeholder="Exam name..." className="w-full text-xl font-extrabold text-slate-800 bg-transparent outline-none placeholder-slate-300 border-b border-transparent focus:border-slate-200 pb-1 transition-colors" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Date</div>
                    <input type="date" value={exam.date} onChange={e => {
                      const newE = [...exams]; newE[i].date = e.target.value; setExams(newE);
                    }} className="px-3 py-1.5 -ml-3 bg-slate-50 border border-transparent rounded-lg outline-none focus:border-slate-200 text-sm font-medium text-slate-600 transition-colors cursor-pointer" />
                  </div>
                  
                  <div className={`py-2 px-4 rounded-xl text-center flex flex-col justify-center min-w-[100px] border ${diff < 0 ? 'bg-slate-50 text-slate-400 border-slate-100' : diff <= 3 ? 'bg-red-50 text-red-600 border-red-100' : diff <= 7 ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                    <span className="text-3xl font-extrabold tracking-tighter leading-none">{Math.abs(diff)}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-80">{diff < 0 ? 'Days Ago' : diff === 1 ? 'Day Left' : 'Days Left'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AssignmentPlanner() {
  return (
    <div className="p-12 text-center w-full max-w-2xl mx-auto py-32">
      <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
         <Calendar className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-2 italic">Assignment Planner</h2>
      <p className="text-slate-500 font-medium">Interactive timeline builder and task breakdown tools are currently in development.</p>
    </div>
  );
}

export function SemesterPlanner() {
  return (
    <div className="p-12 text-center w-full max-w-2xl mx-auto py-32">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-indigo-100 shadow-lg">
         <Calendar className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-2 italic">Semester Planner</h2>
      <p className="text-slate-500 font-medium">Full visual degree roadmap generator is scheduled for the next major release.</p>
    </div>
  );
}
