/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso.TimeRestrictions.UnitTests
{
    using System;
    using Contoso.TimeRestrictions.Services;

    /// <summary>
    /// Contains unit tests for time restriction functionality.
    /// </summary>
    [TestClass]
    public class TimeRestrictionTests
    {
        /// <summary>
        /// Tests that the time cutoff evaluation correctly determines if sales are restricted (legacy behavior with only RestrictedAfter).
        /// </summary>
        [TestMethod]
        [DataRow("20:00", "2026-01-10T19:59:00", false)]
        [DataRow("20:00", "2026-01-10T20:00:00", true)]
        [DataRow("20:00", "2026-01-10T21:00:00", true)]
        public void TimeRestrictionRule_AfterOnlyEvaluation_Works(string after, string nowIso, bool expected)
        {
            var rule = new TimeRestrictionRule
            {
                RestrictedAfter = TimeRestrictionParsers.ParseCutoff(after)
            };
            var now = DateTime.Parse(nowIso);
            Assert.AreEqual(expected, rule.IsRestricted(now));
        }

        /// <summary>
        /// Tests that time window restrictions work correctly (normal daytime window: 08:00 to 20:00).
        /// </summary>
        [TestMethod]
        [DataRow("08:00", "20:00", "2026-01-10T07:59:00", true)]   // Before window - restricted
        [DataRow("08:00", "20:00", "2026-01-10T08:00:00", false)]  // Start of window - allowed
        [DataRow("08:00", "20:00", "2026-01-10T14:00:00", false)]  // Middle of window - allowed
        [DataRow("08:00", "20:00", "2026-01-10T19:59:59", false)]  // End of window - allowed
        [DataRow("08:00", "20:00", "2026-01-10T20:00:00", true)]   // After window - restricted
        [DataRow("08:00", "20:00", "2026-01-10T23:00:00", true)]   // Late night - restricted
        public void TimeRestrictionRule_NormalTimeWindow_Works(string before, string after, string nowIso, bool expectedRestricted)
        {
            var rule = new TimeRestrictionRule
            {
                RestrictedBefore = TimeRestrictionParsers.ParseCutoff(before),
                RestrictedAfter = TimeRestrictionParsers.ParseCutoff(after)
            };
            var now = DateTime.Parse(nowIso);
            Assert.AreEqual(expectedRestricted, rule.IsRestricted(now), $"Failed for time {nowIso}");
        }

        /// <summary>
        /// Tests that overnight time window restrictions work correctly (overnight window: 20:00 to 08:00).
        /// </summary>
        [TestMethod]
        [DataRow("20:00", "08:00", "2026-01-10T07:59:00", false)]  // Before 08:00 - allowed (in overnight window)
        [DataRow("20:00", "08:00", "2026-01-10T08:00:00", true)]   // At 08:00 - restricted
        [DataRow("20:00", "08:00", "2026-01-10T14:00:00", true)]   // Midday - restricted
        [DataRow("20:00", "08:00", "2026-01-10T19:59:59", true)]   // Before 20:00 - restricted
        [DataRow("20:00", "08:00", "2026-01-10T20:00:00", false)]  // At 20:00 - allowed
        [DataRow("20:00", "08:00", "2026-01-10T23:00:00", false)]  // Late night - allowed (in overnight window)
        public void TimeRestrictionRule_OvernightTimeWindow_Works(string before, string after, string nowIso, bool expectedRestricted)
        {
            var rule = new TimeRestrictionRule
            {
                RestrictedBefore = TimeRestrictionParsers.ParseCutoff(before),
                RestrictedAfter = TimeRestrictionParsers.ParseCutoff(after)
            };
            var now = DateTime.Parse(nowIso);
            Assert.AreEqual(expectedRestricted, rule.IsRestricted(now), $"Failed for time {nowIso}");
        }

        /// <summary>
        /// Tests that when RestrictedBefore equals RestrictedAfter, no restriction applies.
        /// </summary>
        [TestMethod]
        [DataRow("08:00", "08:00", "2026-01-10T07:00:00")]
        [DataRow("08:00", "08:00", "2026-01-10T08:00:00")]
        [DataRow("08:00", "08:00", "2026-01-10T14:00:00")]
        [DataRow("08:00", "08:00", "2026-01-10T20:00:00")]
        [DataRow("20:00", "20:00", "2026-01-10T10:00:00")]
        [DataRow("20:00", "20:00", "2026-01-10T20:00:00")]
        public void TimeRestrictionRule_EqualBeforeAndAfter_NoRestriction(string before, string after, string nowIso)
        {
            var rule = new TimeRestrictionRule
            {
                RestrictedBefore = TimeRestrictionParsers.ParseCutoff(before),
                RestrictedAfter = TimeRestrictionParsers.ParseCutoff(after)
            };
            var now = DateTime.Parse(nowIso);
            Assert.IsFalse(rule.IsRestricted(now), $"Should not be restricted when before equals after, but was restricted at {nowIso}");
        }

        /// <summary>
        /// Tests that only RestrictedBefore works correctly.
        /// </summary>
        [TestMethod]
        [DataRow("08:00", "2026-01-10T07:59:00", true)]   // Before 08:00 - restricted
        [DataRow("08:00", "2026-01-10T08:00:00", false)]  // At 08:00 - allowed
        [DataRow("08:00", "2026-01-10T14:00:00", false)]  // After 08:00 - allowed
        public void TimeRestrictionRule_BeforeOnly_Works(string before, string nowIso, bool expectedRestricted)
        {
            var rule = new TimeRestrictionRule
            {
                RestrictedBefore = TimeRestrictionParsers.ParseCutoff(before)
            };
            var now = DateTime.Parse(nowIso);
            Assert.AreEqual(expectedRestricted, rule.IsRestricted(now));
        }

        /// <summary>
        /// Tests that day-of-week filtering works correctly with time windows.
        /// </summary>
        [TestMethod]
        public void TimeRestrictionRule_TimeWindowWithDayFilter_Works()
        {
            var rule = new TimeRestrictionRule
            {
                RestrictedBefore = TimeRestrictionParsers.ParseCutoff("08:00"),
                RestrictedAfter = TimeRestrictionParsers.ParseCutoff("20:00"),
                Days = TimeRestrictionParsers.ParseDays("Mon,Wed,Fri")
            };
            
            // Friday at 07:00 (before window) should be restricted
            var friEarly = new DateTime(2026, 1, 9, 7, 0, 0); // Friday
            Assert.IsTrue(rule.IsRestricted(friEarly));
            
            // Friday at 14:00 (in window) should not be restricted
            var friMid = new DateTime(2026, 1, 9, 14, 0, 0); // Friday
            Assert.IsFalse(rule.IsRestricted(friMid));
            
            // Sunday at 07:00 (not a restriction day) should not be restricted
            var sunEarly = new DateTime(2026, 1, 11, 7, 0, 0); // Sunday
            Assert.IsFalse(rule.IsRestricted(sunEarly));
        }

        /// <summary>
        /// Tests that a rule with no time restrictions does not restrict sales.
        /// </summary>
        [TestMethod]
        public void TimeRestrictionRule_WithNoTimes_IsNotRestricted()
        {
            var rule = new TimeRestrictionRule();
            var now = DateTime.Now;
            Assert.IsFalse(rule.IsRestricted(now));
        }

        /// <summary>
        /// Tests that sales are not restricted when the current day is not in the restriction days.
        /// </summary>
        [TestMethod]
        public void TimeRestrictionRule_WithDaysButNoMatch_IsNotRestricted()
        {
            var rule = new TimeRestrictionRule
            {
                RestrictedAfter = TimeRestrictionParsers.ParseCutoff("20:00"),
                Days = TimeRestrictionParsers.ParseDays("Mon,Tue")
            };
            // Wednesday is not in the restriction days
            var wed = new DateTime(2026, 1, 7, 21, 0, 0); // Wednesday after cutoff
            Assert.IsFalse(rule.IsRestricted(wed));
        }

        /// <summary>
        /// Tests that ParseCutoff correctly parses a valid time string.
        /// </summary>
        [TestMethod]
        public void TimeRestrictionParsers_ParseCutoff_HandlesValidTime()
        {
            var cutoff = TimeRestrictionParsers.ParseCutoff("14:30");
            Assert.IsNotNull(cutoff);
            Assert.AreEqual(14, cutoff.Value.Hours);
            Assert.AreEqual(30, cutoff.Value.Minutes);
        }

        /// <summary>
        /// Tests that ParseCutoff returns null for invalid time strings.
        /// </summary>
        [TestMethod]
        public void TimeRestrictionParsers_ParseCutoff_HandlesInvalidTime()
        {
            var cutoff = TimeRestrictionParsers.ParseCutoff("invalid");
            Assert.IsNull(cutoff);
        }

        /// <summary>
        /// Tests that ParseCutoff returns null for null, empty, or whitespace input.
        /// </summary>
        [TestMethod]
        public void TimeRestrictionParsers_ParseCutoff_HandlesNullOrEmpty()
        {
            Assert.IsNull(TimeRestrictionParsers.ParseCutoff(null!));
            Assert.IsNull(TimeRestrictionParsers.ParseCutoff(""));
            Assert.IsNull(TimeRestrictionParsers.ParseCutoff("   "));
        }

        /// <summary>
        /// Tests that ParseDays correctly parses a comma-separated list of day names.
        /// </summary>
        [TestMethod]
        public void TimeRestrictionParsers_ParseDays_HandlesValidDays()
        {
            var days = TimeRestrictionParsers.ParseDays("Mon,Wed,Fri");
            var expected = new HashSet<DayOfWeek> { DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday };
            Assert.IsNotNull(days);
            Assert.IsTrue(days.SetEquals(expected));
        }

        /// <summary>
        /// Tests that ParseDays handles null, empty, or whitespace input.
        /// </summary>
        [TestMethod]
        public void TimeRestrictionParsers_ParseDays_HandlesNullOrEmpty()
        {
            var nullResult = TimeRestrictionParsers.ParseDays(string.Empty);
            Assert.IsNotNull(nullResult);
            Assert.IsFalse(nullResult.Any());

            var emptyResult = TimeRestrictionParsers.ParseDays("");
            Assert.IsNotNull(emptyResult);
            Assert.IsFalse(emptyResult.Any());

            var whitespaceResult = TimeRestrictionParsers.ParseDays("   ");
            Assert.IsNotNull(whitespaceResult);
            Assert.IsFalse(whitespaceResult.Any());
        }

        /// <summary>
        /// Tests that ParseDays ignores invalid day names.
        /// </summary>
        [TestMethod]
        public void TimeRestrictionParsers_ParseDays_IgnoresInvalidDays()
        {
            var days = TimeRestrictionParsers.ParseDays("Mon,InvalidDay,Wed");
            var expected = new HashSet<DayOfWeek> { DayOfWeek.Monday, DayOfWeek.Wednesday };
            Assert.IsNotNull(days);
            Assert.IsTrue(days.SetEquals(expected));
        }
    }
}
