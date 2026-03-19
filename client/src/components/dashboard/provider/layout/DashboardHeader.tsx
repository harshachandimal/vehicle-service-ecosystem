

interface DashboardHeaderProps {
    title: string;
    subtitle: string;
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
    return (
        <header className="flex justify-between items-center mb-12">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
                <p className="text-slate-500 mt-2 text-lg">{subtitle}</p>
            </div>
        </header>
    );
}
