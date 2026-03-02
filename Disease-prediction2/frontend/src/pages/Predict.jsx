import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Search, CheckCircle2, AlertCircle, Sparkles, Stethoscope, Activity, Heart } from 'lucide-react';
import { mainService, medicineService } from '../services/api';

const symptomsList = [
    'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills', 'joint_pain',
    'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition', 'spotting_ urination',
    'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness', 'lethargy',
    'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever', 'sunken_eyes', 'breathlessness', 'sweating',
    'dehydration', 'indigestion', 'headache', 'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes',
    'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine',
    'yellowing_of_eyes', 'acute_liver_failure', 'swelling_of_stomach',
    'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm', 'throat_irritation',
    'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs',
    'fast_heart_rate', 'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool',
    'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity', 'swollen_legs',
    'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails',
    'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips',
    'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints',
    'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness',
    'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort', 'foul_smell_of urine',
    'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)',
    'depression', 'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body', 'belly_pain',
    'abnormal_menstruation', 'dischromic _patches', 'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum',
    'rusty_sputum', 'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion',
    'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen',
    'history_of_alcohol_consumption', 'fluid_overload', 'blood_in_sputum', 'prominent_veins_on_calf',
    'palpitations', 'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring', 'skin_peeling',
    'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister', 'red_sore_around_nose',
    'yellow_crust_ooze',
].sort();

const Predict = () => {
    const navigate = useNavigate();
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [consultLoading, setConsultLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [drug, setDrug] = useState(null);
    const [error, setError] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);

    const toggleSymptom = (symptom) => {
        if (selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
        } else {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };

    const handlePredict = async () => {
        if (selectedSymptoms.length === 0) return;
        setLoading(true);
        setError(null);
        try {
            const res = await mainService.predictDisease(selectedSymptoms);
            if (res.error) {
                setError(res.error);
                return;
            }
            setResult(res);
            const drugRes = await medicineService.search(res.predicted_disease);
            setDrug(drugRes.drug);

            // Fetch and filter doctors
            const allDoctors = await mainService.getDoctors();
            const specialists = allDoctors.filter(d =>
                d.specialization.toLowerCase() === res.consult_doctor.toLowerCase()
            );

            if (specialists.length > 0) {
                setDoctors(specialists);
                setSelectedDoctorId(specialists[0].user?.id || specialists[0].user);
            } else {
                setDoctors(allDoctors);
                if (allDoctors.length > 0) {
                    setSelectedDoctorId(allDoctors[0].user?.id || allDoctors[0].user);
                }
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Neural link failed. Verify backend model status.");
        } finally {
            setLoading(false);
        }
    };

    const handleConsult = async () => {
        if (!result || !selectedDoctorId) return;
        setConsultLoading(true);
        try {
            const payload = {
                doctor_id: selectedDoctorId,
                diseaseinfo_id: result.id
            };
            console.log("Consultation Payload:", payload);

            const consultation = await mainService.createConsultation(payload);
            navigate(`/consultation/${consultation.id}`);
        } catch (err) {
            const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : "Check your network connection.";
            alert(`Secure channel creation failed: ${errorMsg}`);
            console.error("Consultation Error:", err.response?.data || err);
        } finally {
            setConsultLoading(false);
        }
    };

    const filteredSymptoms = symptomsList.filter(s =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
            <div className="flex flex-col items-center mb-16 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20 relative"
                >
                    <BrainCircuit className="text-primary w-10 h-10" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full -z-10"></div>
                </motion.div>
                <h1 className="text-4xl font-black mb-4">Diagnostic <span className="text-primary">Intelligence</span></h1>
                <p className="text-slate-400 max-w-lg font-light">Identify potential health concerns by selecting your symptoms for our AI clinical engine.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 items-start">
                <div className="flex-1 w-full space-y-6">
                    <div className="glass p-8 space-y-6">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                className="input-premium pl-12 py-4 bg-darker/50"
                                placeholder="Search symptoms..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
                            {filteredSymptoms.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => toggleSymptom(s)}
                                    className={`p-4 text-xs font-bold rounded-xl border flex items-center justify-between transition-all duration-300 ${selectedSymptoms.includes(s)
                                        ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(99,102,241,0.2)] text-white'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/[0.07]'
                                        }`}
                                >
                                    <span className="capitalize truncate mr-2">{s.replace(/_/g, ' ')}</span>
                                    {selectedSymptoms.includes(s) && <CheckCircle2 size={14} className="text-primary flex-shrink-0" />}
                                </button>
                            ))}
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-white/5">
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                {selectedSymptoms.length} <span className="text-primary">Selected</span>
                            </div>
                            <button
                                onClick={() => setSelectedSymptoms([])}
                                className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:w-[400px] w-full sticky top-32">
                    {!result ? (
                        <div className="glass p-10 text-center space-y-8 h-full flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-bounce">
                                <Sparkles size={30} className="text-primary/40" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3">Ready to analyze?</h3>
                                <p className="text-sm text-slate-400 font-light leading-relaxed mb-8">
                                    Please select at least one symptom from the list to begin the clinical diagnostic analysis.
                                </p>
                                {error && (
                                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-bold uppercase tracking-tight">
                                        <AlertCircle size={16} /> {error}
                                    </div>
                                )}
                                <button
                                    onClick={handlePredict}
                                    disabled={selectedSymptoms.length === 0 || loading}
                                    className="btn-gradient w-full disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 py-4 shadow-2xl"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <BrainCircuit size={20} />
                                            Analyze Health
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            <div className="glass p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border-primary/30 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4">
                                    <Activity size={24} className="text-primary/20 group-hover:text-primary/40 transition-colors" />
                                </div>

                                <div className="text-xs font-black uppercase tracking-[0.2em] text-primary-400 mb-2">Findings</div>
                                <h2 className="text-3xl font-black mb-1 truncate">{result.predicted_disease}</h2>
                                <div className="text-emerald-400 font-black text-lg mb-8">{result.confidence}% Confidence</div>

                                <div className="space-y-5 border-t border-white/10 pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                            <Stethoscope size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Specialist</div>
                                            <div className="font-bold text-sm tracking-tight">{result.consult_doctor}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                            <Heart size={20} className="text-rose-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Medication</div>
                                            <div className="font-bold text-sm tracking-tight truncate w-48">{drug || "Consult Physician"}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Selection */}
                                <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                                    <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                        Available {doctors.length > 0 && doctors[0].specialization.toLowerCase() === result.consult_doctor.toLowerCase() ? "Specialists" : "Medical Professionals"}
                                    </div>
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {doctors.length > 0 ? (
                                            doctors.map((doc) => (
                                                <button
                                                    key={doc.user?.id || doc.user}
                                                    onClick={() => setSelectedDoctorId(doc.user?.id || doc.user)}
                                                    className={`w-full p-3 rounded-xl border text-left transition-all group/doc ${selectedDoctorId === (doc.user?.id || doc.user)
                                                            ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className="font-bold text-sm flex items-center justify-between">
                                                        <span>Dr. {doc.name}</span>
                                                        {selectedDoctorId === (doc.user?.id || doc.user) && <CheckCircle2 size={12} className="text-primary" />}
                                                    </div>
                                                    <div className="text-[9px] text-slate-500 uppercase tracking-tighter mt-1">{doc.specialization}</div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-xs text-slate-500 italic">No doctors found.</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10 space-y-3">
                                    <button
                                        onClick={handleConsult}
                                        disabled={consultLoading}
                                        className="btn-gradient w-full text-sm py-4 flex items-center justify-center gap-2"
                                    >
                                        {consultLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Stethoscope size={18} />
                                                Launch Specialist Consultation
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setResult(null)}
                                        className="w-full py-3 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                                    >
                                        Start Over
                                    </button>
                                </div>
                            </div>

                            <div className="glass p-4 border-amber-500/20 bg-amber-500/5 flex gap-3 items-start">
                                <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-[10px] text-amber-500/80 leading-normal font-medium">
                                    CAUTION: This analysis is provided for educational purposes and is not a clinical diagnosis. Always seek professional advice.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Predict;
