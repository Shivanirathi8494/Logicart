import PageContainer from "@/components/page/PageContainer";
import PageHero from "@/components/page/PageHero";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage(){

return(

<>

<PageHero
title="Forgot Password"
subtitle="Reset your account password."
/>

<PageContainer>

<div className="mx-auto max-w-md rounded-xl border bg-white p-8 shadow">

<div className="space-y-5">

<div>

<label className="mb-2 block font-medium">

Email Address

</label>

<input
className="w-full rounded-lg border p-3"
placeholder="Enter your email"
/>

</div>

<Button className="w-full">

Send Reset Link

</Button>

</div>

</div>

</PageContainer>

</>

);

}
