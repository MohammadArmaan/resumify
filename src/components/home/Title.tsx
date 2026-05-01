interface TitleProps {
    title: string;
    description: string;
}
export default function Title({ title, description }: TitleProps) {
    return (
        <div className="text-center mt-6 text-foreground">
            <h2 className="text-xl sm:text-3xl mt-4 font-medium">{title}</h2>
            <p className="max-sm max-w-2xl p-5 mt-2 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}
