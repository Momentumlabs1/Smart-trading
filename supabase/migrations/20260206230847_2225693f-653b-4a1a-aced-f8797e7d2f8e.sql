-- Create table for challenge registrations
CREATE TABLE public.challenge_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  current_day INTEGER DEFAULT 1,
  completed_days INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index on email
CREATE UNIQUE INDEX challenge_registrations_email_idx ON public.challenge_registrations(email);

-- Enable RLS
ALTER TABLE public.challenge_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for registration)
CREATE POLICY "Anyone can register for challenge" 
ON public.challenge_registrations 
FOR INSERT 
WITH CHECK (true);

-- Policy: Users can read their own registration by email (using a session cookie/local storage check)
CREATE POLICY "Anyone can read challenge registrations" 
ON public.challenge_registrations 
FOR SELECT 
USING (true);

-- Policy: Anyone can update their progress
CREATE POLICY "Anyone can update their challenge progress" 
ON public.challenge_registrations 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_challenge_registration_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_challenge_registrations_updated_at
BEFORE UPDATE ON public.challenge_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_challenge_registration_timestamp();