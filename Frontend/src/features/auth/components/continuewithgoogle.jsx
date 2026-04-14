const GOOGLE_AUTH_ENDPOINT = "/api/auth/google";

const GoogleIcon = () => {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.64 9.2045c0-.6382-.0573-1.2518-.1636-1.8409H9v3.4818h4.8436c-.2086 1.125-.8427 2.0782-1.7968 2.7164v2.2582h2.9086c1.7018-1.5663 2.6846-3.8745 2.6846-6.6155Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1791l-2.9086-2.2582c-.8059.54-1.8368.8591-3.0477.8591-2.3468 0-4.3323-1.5845-5.0427-3.7127H.9509v2.3318C2.4314 15.9836 5.4818 18 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.9573 10.7082A5.409 5.409 0 0 1 3.675 9c0-.5932.1023-1.1686.2823-1.7082V4.96H.9509A8.9993 8.9993 0 0 0 0 9c0 1.45.3482 2.8227.9509 4.04l3.0064-2.3318Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.5782c1.3214 0 2.5077.4541 3.4405 1.3459l2.5814-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4314 2.0164.9509 4.96L3.9573 7.2918C4.6677 5.1627 6.6532 3.5782 9 3.5782Z"
        fill="#EA4335"
      />
    </svg>
  );
};

const ContinueWithGoogle = ({
  label = "Continue with Google",
  className = "",
}) => {
  return (
    <a
      href={GOOGLE_AUTH_ENDPOINT}
      className={`flex min-h-10 w-full items-center justify-center gap-3 rounded-full border border-[#dadce0] bg-white px-4 py-2.5 text-sm font-medium text-[#3c4043] shadow-[0_1px_2px_rgba(60,64,67,0.15),0_1px_3px_1px_rgba(60,64,67,0.1)] transition-colors duration-200 hover:bg-[#f8f9fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      <GoogleIcon />
      <span>{label}</span>
    </a>
  );
};

export default ContinueWithGoogle;
