-- Add recurrence columns to financial_goals table
ALTER TABLE financial_goals
ADD COLUMN recurrence TEXT DEFAULT 'none' CHECK (recurrence IN ('none', 'weekly', 'monthly', 'quarterly', 'yearly')),
ADD COLUMN recurrence_interval INTEGER DEFAULT 1 CHECK (recurrence_interval >= 1 AND recurrence_interval <= 12);

-- Add comment to document the columns
COMMENT ON COLUMN financial_goals.recurrence IS 'Recurrence type for the goal: none, weekly, monthly, quarterly, yearly';
COMMENT ON COLUMN financial_goals.recurrence_interval IS 'Interval for recurrence (e.g., every 2 weeks, every 3 months)';
