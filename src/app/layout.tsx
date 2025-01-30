export const RootLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    );
}

export default RootLayout;
