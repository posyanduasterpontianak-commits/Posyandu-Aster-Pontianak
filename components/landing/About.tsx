import { Target, Compass, Layers, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function About() {
  let profile = null;
  try {
    profile = await prisma.profile.findFirst();
  } catch (error) {
    console.error("[About] Database profile error:", error);
  }

  const visionText = profile?.vision || "Terwujudnya Keluarga Sehat, Mandiri, dan Sejahtera Berbasis Pemberdayaan Masyarakat menuju Generasi Bebas Stunting.";
  
  const missionItems = profile?.mission
    ? profile.mission.split("\n").filter((line) => line.trim().length > 0)
    : [
        "Menyediakan pelayanan pemantauan gizi dan stunting balita secara terukur.",
        "Memberikan pengawasan kesehatan berkala bagi ibu hamil dan pencegahan resiko tinggi.",
        "Menyelenggarakan edukasi kesehatan remaja dan pencegahan anemia.",
        "Mendorong skrining Penyakit Tidak Menular (PTM) untuk usia produktif dan lansia.",
        "Transparansi data pencatatan melalui digitalisasi layanan Posyandu.",
      ];

  const spmFields = [
    { title: "Kesehatan", desc: "Pemeriksaan ibu hamil, balita, imunisasi, penimbangan berat badan, serta gizi." },
    { title: "Pendidikan", desc: "Edukasi anak usia dini (PAUD) dan peningkatan literasi keluarga." },
    { title: "Pekerjaan Umum", desc: "Akses data dan informasi kebersihan lingkungan, sanitasi, serta air bersih." },
    { title: "Perumahan Rakyat", desc: "Pemantauan dan data rumah layak huni serta lingkungan sehat." },
    { title: "Ketenteraman, Ketertiban Umum, & Perlindungan Masyarakat", desc: "Koordinasi keamanan lingkungan dan mitigasi bencana." },
    { title: "Sosial", desc: "Pendataan perlindungan sosial bagi kelompok rentan, lansia, dan penyandang disabilitas." },
  ];

  return (
    <section id="tentang" className="py-20 bg-white border-y border-gray-200/60">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Tentang {profile?.organizationName || "Posyandu Aster"}
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">
            {profile?.tagline || "Wadah pelayanan kesehatan masyarakat yang berfokus pada kesehatan balita, ibu hamil, remaja, hingga lansia secara terukur dan terintegrasi."}
          </p>
        </div>

        {/* Grid 2 Columns: SPM & Visi Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 6 SPM Posyandu & Quick Info */}
          <div className="lg:col-span-5 bg-gray-50 border border-gray-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Rincian 6 Bidang SPM Posyandu</h3>
              
              <div className="space-y-3 mb-6">
                {spmFields.map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-200/70 rounded-xl p-3 shadow-2xs">
                    <p className="text-xs font-bold text-blue-700">{item.title}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Boxes */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200/80">
              <div className="bg-white border border-gray-200/80 rounded-xl p-3.5">
                <p className="text-xs font-semibold text-gray-500">Jumlah Pengurus</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">11 Kader</p>
                <p className="text-[10px] text-blue-600 font-medium mt-0.5">Aktif & Tersertifikasi</p>
              </div>

              <div className="bg-white border border-gray-200/80 rounded-xl p-3.5">
                <p className="text-xs font-semibold text-gray-500">Jumlah Pelayanan</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">6 SPM</p>
                <p className="text-[10px] text-blue-600 font-medium mt-0.5">Siklus Hidup Lengkap</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visi & Misi */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Visi */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Visi Posyandu</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    &quot;{visionText}&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Misi */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs flex-1">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 mb-3">Misi Posyandu</h3>
                  <ul className="space-y-2.5">
                    {missionItems.map((misi, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{misi.replace(/^[-*•\d.]+\s*/, "")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
