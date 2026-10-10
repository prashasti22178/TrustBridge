import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  UserCheck, 
  Scale, 
  FileText, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Fairness() {
  const charterPoints = [
    {
      title: '1. Consent First (100% Explicit)',
      icon: Lock,
      color: 'emerald',
      badge: 'Mandatory',
      description:
        'Borrowers must provide affirmative, explicit consent before any assessment or signal calculation begins. Zero stealth tracking or third-party data broker purchases.',
      details: [
        'Clear preview of every data point evaluated before submission',
        'Borrower can withdraw pending applications anytime',
        'Zero cross-selling or monetization of applicant records'
      ]
    },
    {
      title: '2. Right to Explanation',
      icon: Eye,
      color: 'indigo',
      badge: 'Transparency',
      description:
        'No opaque black-box machine learning models. Every applicant receives an itemized breakdown of "What Helped" and "What Needs Attention" in plain, understandable language.',
      details: [
        'Deterministic mathematical weights (40% Ability, 35% Willingness, 25% Stability)',
        'Point-by-point contribution of each everyday signal',
        'Clear guidance on how to strengthen score over the next 90 days'
      ]
    },
    {
      title: '3. Right to Dispute',
      icon: FileText,
      color: 'indigo',
      badge: 'Accountability',
      description:
        'Every borrower has the institutional right to challenge inaccurate signal entries, contest flagged receipt gaps, or submit supplementary proofs for re-evaluation.',
      details: [
        'Direct channel to human underwriter for dispute resolution',
        'Audit-logged proof re-upload capability',
        'No penalty or negative score impact for initiating a review'
      ]
    },
    {
      title: '4. Strict Data Minimization',
      icon: Scale,
      color: 'amber',
      badge: 'Privacy',
      description:
        'We collect strictly the minimum financial telemetry required to evaluate cashflow and payment reliability. We never inspect browsing history, call logs, SMS, or contacts.',
      details: [
        'Only 6 verified operational business signals evaluated',
        'Zero tracking of personal consumer lifestyle expenses',
        'Encrypted storage on Supabase with Row Level Security (RLS)'
      ]
    },
    {
      title: '5. Zero Demographic Scoring',
      icon: ShieldCheck,
      color: 'emerald',
      badge: 'Non-Discrimination',
      description:
        'We strictly NEVER collect, store, or factor in caste, religion, gender, marital status, or social media activity. Only verified commercial operational discipline is scored.',
      details: [
        'No caste, religion, or community proxies in underwriting formulas',
        'Gender-neutral cashflow evaluation',
        'Exclusion of non-commercial personal data'
      ]
    },
    {
      title: '6. Human Oversight Guarantee',
      icon: UserCheck,
      color: 'indigo',
      badge: 'Human-in-the-Loop',
      description:
        'Artificial Intelligence (Gemini Flash) is restricted solely to neutral plain-language summary generation. An AI or automated formula NEVER automatically rejects an applicant.',
      details: [
        'Final loan sanction decisions require a certified human underwriter',
        'Underwriters can override formula scores based on verified contextual proofs',
        'Every underwriter action generates an immutable audit trail'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Institutional Charter</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Fairness & Privacy Charter
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
          TrustBridge is architected to minimize inappropriate demographic influence through strict data minimization, deterministic scoring transparency, immutable auditability, and mandatory human oversight.
        </p>
      </div>

      {/* Ethical AI Guiding Philosophy Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-12 shadow-xl backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            <Scale className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white">
              Our Core Philosophical Principle
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We do not make mathematically impossible or dishonest claims of "zero bias." Real-world data carries systemic inequalities. Instead, TrustBridge guarantees transparency: every variable is declared in open formula weights, demographic attributes are structurally barred from entering the model, and all rejections or sanctions are signed off by a human underwriter.
            </p>
          </div>
        </div>
      </div>

      {/* Charter Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charterPoints.map((point, idx) => {
          const Icon = point.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-white">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {point.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{point.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {point.description}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
                  {point.details.map((detail, dIdx) => (
                    <div key={dIdx} className="text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Underwriter Human-in-the-Loop Clarification */}
      <div className="mt-12 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <UserCheck className="h-4 w-4 text-indigo-400" />
            Inspect the Underwriter Cockpit
          </h4>
          <p className="text-xs text-slate-400 max-w-xl">
            See how real human underwriters review verified receipts, audit trails, and deterministic scores before granting capital.
          </p>
        </div>
        <Link
          to="/underwriter"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors shrink-0 shadow-lg shadow-indigo-600/20"
        >
          Open Underwriter Console →
        </Link>
      </div>

    </div>
  );
}
