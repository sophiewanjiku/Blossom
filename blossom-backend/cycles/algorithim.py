from datetime import date, timedelta
from dataclasses import dataclass
from typing import Optional

# ============================================================
# BLOSSOM CYCLE PREDICTION ALGORITHM
#
# This is a pure Python algorithm — no Django, no database.
# It takes dates and numbers as input and returns predictions.
# Keeping it pure means it's easy to test and easy to improve.
#
# HOW ALGORITHMS WORK:
# An algorithm is just a set of steps that transforms input
# into output. Every step is deterministic — the same input
# always produces the same output. We build it in small
# functions, each doing ONE thing, then compose them together.
# ============================================================


@dataclass
class CyclePrediction:
    """
    A dataclass is like a clean container for related data.
    It automatically generates __init__, __repr__ etc.
    Think of it as a structured return value.
    """
    current_day:        int
    total_days:         int
    phase:              str          # 'menstrual' | 'follicular' | 'ovulation' | 'luteal'
    phase_name:         str          # Human readable: 'Menstrual Phase'
    phase_day:          int          # Day within current phase (e.g. day 2 of luteal)
    days_until_period:  int
    next_period_date:   date
    ovulation_date:     date
    fertile_start:      date
    fertile_end:        date
    is_fertile_now:     bool
    period_length:      int
    cycle_length:       int


@dataclass
class CalendarDay:
    """Represents a single day on the calendar with its type."""
    date:      date
    day_type:  str   # 'period' | 'fertile' | 'ovulation' | 'predicted' | 'normal'
    cycle_day: int   # which day of the cycle this is


# ============================================================
# STEP 1 — Calculate the current cycle day
# ============================================================

def get_current_cycle_day(last_period_date: date, today: date) -> int:
    """
    How many days have passed since the last period started?
    Day 1 = the first day of your period.

    Example:
    last_period_date = June 1
    today            = June 14
    delta            = 13 days
    cycle_day        = 13 + 1 = 14
    """
    delta = (today - last_period_date).days
    # We add 1 because day 1 is the first day of the period
    return max(1, delta + 1)


# ============================================================
# STEP 2 — Determine the cycle phase
# ============================================================

def get_phase(cycle_day: int, cycle_length: int, period_length: int) -> tuple[str, str, int]:
    """
    Given a cycle day, return the phase.

    Returns a tuple of (key, display_name, day_within_phase)

    The key insight: ovulation always happens ~14 days BEFORE
    the next period, not 14 days after the last period.
    This is why we calculate from the end, not the start.

    Phase boundaries:
    - Menstrual:   day 1 → period_length (typically 1-5)
    - Follicular:  period_length+1 → ovulation_day-1
    - Ovulation:   ovulation_day (cycle_length - 14)
    - Luteal:      ovulation_day+1 → cycle_length
    """
    # Ovulation is always ~14 days before next period
    ovulation_day = cycle_length - 14

    if cycle_day <= period_length:
        return ('menstrual', 'Menstrual Phase', cycle_day)

    elif cycle_day < ovulation_day:
        day_in_phase = cycle_day - period_length
        return ('follicular', 'Follicular Phase', day_in_phase)

    elif cycle_day == ovulation_day:
        return ('ovulation', 'Ovulation', 1)

    else:
        day_in_phase = cycle_day - ovulation_day
        return ('luteal', 'Luteal Phase', day_in_phase)


# ============================================================
# STEP 3 — Predict the next period date
# ============================================================

def get_next_period_date(last_period_date: date, cycle_length: int) -> date:
    """
    Next period = last period + average cycle length.

    This is the simplest prediction. As we collect more data
    (multiple cycles), we can improve this with a weighted
    average or a moving average algorithm.
    """
    return last_period_date + timedelta(days=cycle_length)


# ============================================================
# STEP 4 — Calculate the fertile window
# ============================================================

def get_fertile_window(
    next_period_date: date,
    cycle_length: int
) -> tuple[date, date, date]:
    """
    The fertile window is the days when conception is possible.

    Ovulation happens ~14 days before the next period.
    Sperm can survive ~5 days.
    An egg survives ~24 hours after ovulation.

    So the fertile window is:
    - 5 days before ovulation (sperm waiting)
    - Ovulation day itself
    - 1 day after ovulation (egg viability)

    Returns (fertile_start, ovulation_date, fertile_end)
    """
    ovulation_date = next_period_date - timedelta(days=14)
    fertile_start  = ovulation_date - timedelta(days=5)
    fertile_end    = ovulation_date + timedelta(days=1)

    return (fertile_start, ovulation_date, fertile_end)


# ============================================================
# STEP 5 — Check if today is in the fertile window
# ============================================================

def is_fertile_today(
    today: date,
    fertile_start: date,
    fertile_end: date
) -> bool:
    """
    Simple range check.
    This is the kind of tiny, single-purpose function that
    makes algorithms readable and testable.
    """
    return fertile_start <= today <= fertile_end


# ============================================================
# STEP 6 — COMPOSE all steps into one prediction
# ============================================================

def predict_cycle(
    last_period_date: date,
    cycle_length: int     = 28,
    period_length: int    = 5,
    today: Optional[date] = None
) -> CyclePrediction:
    """
    The main function — composes all the smaller functions.

    This is called 'function composition' — building complex
    behaviour by combining simple functions. Each function
    does one thing well, and we chain them together.
    """
    if today is None:
        today = date.today()

    # Run each step in sequence
    current_day = get_current_cycle_day(last_period_date, today)

    # If we're past one full cycle, recalculate from the
    # predicted next period (handles multi-cycle navigation)
    effective_day = current_day
    effective_last = last_period_date

    if current_day > cycle_length:
        # How many complete cycles have passed?
        cycles_passed = (current_day - 1) // cycle_length
        effective_last = last_period_date + timedelta(
            days=cycles_passed * cycle_length
        )
        effective_day = current_day - (cycles_passed * cycle_length)

    phase_key, phase_name, phase_day = get_phase(
        effective_day, cycle_length, period_length
    )

    next_period = get_next_period_date(effective_last, cycle_length)

    fertile_start, ovulation_date, fertile_end = get_fertile_window(
        next_period, cycle_length
    )

    fertile_now = is_fertile_today(today, fertile_start, fertile_end)

    days_until = (next_period - today).days

    return CyclePrediction(
        current_day       = effective_day,
        total_days        = cycle_length,
        phase             = phase_key,
        phase_name        = phase_name,
        phase_day         = phase_day,
        days_until_period = max(0, days_until),
        next_period_date  = next_period,
        ovulation_date    = ovulation_date,
        fertile_start     = fertile_start,
        fertile_end       = fertile_end,
        is_fertile_now    = fertile_now,
        period_length     = period_length,
        cycle_length      = cycle_length,
    )


# ============================================================
# STEP 7 — Generate calendar data for a full month
# ============================================================

def get_calendar_month(
    last_period_date: date,
    cycle_length: int,
    period_length: int,
    year: int,
    month: int,
) -> list[CalendarDay]:
    """
    Returns a list of CalendarDay objects for every day
    in the requested month, each tagged with its type.

    This is what the calendar UI reads to decide which
    colour/style to apply to each date.
    """
    from calendar import monthrange

    # Get number of days in the requested month
    _, days_in_month = monthrange(year, month)

    calendar_days = []

    for day_num in range(1, days_in_month + 1):
        current_date = date(year, month, day_num)

        # Calculate cycle day for this calendar date
        cycle_day = get_current_cycle_day(last_period_date, current_date)

        # Normalise to within one cycle
        if cycle_day > cycle_length:
            cycles_passed = (cycle_day - 1) // cycle_length
            cycle_day = cycle_day - (cycles_passed * cycle_length)

        # Get prediction for this date
        prediction = predict_cycle(
            last_period_date=last_period_date,
            cycle_length=cycle_length,
            period_length=period_length,
            today=current_date
        )

        # Determine the day type for the calendar
        if prediction.phase == 'menstrual':
            day_type = 'period'
        elif current_date == prediction.ovulation_date:
            day_type = 'ovulation'
        elif prediction.is_fertile_now:
            day_type = 'fertile'
        elif current_date == prediction.next_period_date:
            day_type = 'predicted'
        else:
            day_type = 'normal'

        calendar_days.append(CalendarDay(
            date=current_date,
            day_type=day_type,
            cycle_day=cycle_day,
        ))

    return calendar_days


# ============================================================
# STEP 8 — Improved prediction using cycle history
# ============================================================

def predict_cycle_from_history(
    period_dates: list[date],
    period_length: int = 5,
    today: Optional[date] = None,
) -> CyclePrediction:
    """
    A smarter version — if we have multiple past period dates,
    we calculate the AVERAGE cycle length from real data
    instead of using a fixed 28 days.

    This is the bridge between a simple algorithm and ML.
    As data grows, predictions improve automatically.

    HOW IT WORKS:
    If periods started on: June 1, July 3, Aug 4
    Gaps are: 32 days, 32 days
    Average: 32 days → more accurate than assuming 28
    """
    if not period_dates:
        raise ValueError("Need at least one period date")

    if today is None:
        today = date.today()

    # Sort dates oldest first
    sorted_dates = sorted(period_dates)

    # Need at least 2 dates to calculate a cycle length
    if len(sorted_dates) == 1:
        return predict_cycle(
            last_period_date=sorted_dates[0],
            cycle_length=28,
            period_length=period_length,
            today=today,
        )

    # Calculate gaps between consecutive periods
    gaps = []
    for i in range(1, len(sorted_dates)):
        gap = (sorted_dates[i] - sorted_dates[i - 1]).days
        gaps.append(gap)

    # Simple average
    # Future improvement: weighted average (recent cycles count more)
    average_cycle_length = round(sum(gaps) / len(gaps))

    # Clamp to a safe range (21-45 days is medically normal)
    average_cycle_length = max(21, min(45, average_cycle_length))

    last_period = sorted_dates[-1]

    return predict_cycle(
        last_period_date=last_period,
        cycle_length=average_cycle_length,
        period_length=period_length,
        today=today,
    )