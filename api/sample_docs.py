"""
Pre-loaded demo legal documents for LegalBuddy.
Enables instant testing and evaluation without requiring manual PDF uploads.
"""

SAMPLE_DOCUMENTS = {
    "demo_nda": {
        "doc_id": "demo_nda",
        "name": "Mutual_Non_Disclosure_Agreement.pdf",
        "type": "NDA",
        "description": "Standard tech company mutual NDA with confidentiality, IP, and breach terms.",
        "text": """MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into by and between AlphaTech Inc. ("Disclosing Party") and Beta Solutions LLC ("Receiving Party").

1. DEFINITION OF CONFIDENTIAL INFORMATION
Confidential Information includes all non-public technical, business, financial, or proprietary information disclosed by either party, including source code, customer lists, product roadmaps, and trade secrets.

2. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party shall hold all Confidential Information in strict confidence and shall not disclose it to third parties without prior written consent. The Receiving Party agrees to protect Confidential Information using at least the same degree of care as it uses for its own confidential info, but not less than reasonable care.

3. TERM AND TERMINATION
This Agreement shall remain in effect for a period of three (3) years from the Effective Date. The confidentiality obligations herein shall survive termination of this Agreement for an additional period of five (5) years.

4. REMEDIES AND INDEMNIFICATION
The Receiving Party agrees to indemnify, defend, and hold harmless the Disclosing Party against any damages, losses, or legal costs arising from unauthorized disclosure of Confidential Information. In the event of a breach, the Disclosing Party shall be entitled to seek injunctive relief without posting a bond.

5. GOVERNING LAW AND JURISDICTION
This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles. Any dispute shall be resolved exclusively in the state or federal courts located in Santa Clara County, California.
""",
        "risk_heatmap": [
            {"section": "Section 1: Confidential Information", "risk": "LOW", "score": 15, "reason": "Standard definition covering trade secrets and proprietary data."},
            {"section": "Section 2: Obligations of Care", "risk": "LOW", "score": 20, "reason": "Standard reasonable care requirement for mutual protection."},
            {"section": "Section 3: Term & Survival", "risk": "MEDIUM", "score": 55, "reason": "5-year survival clause after 3-year term is slightly longer than standard 2-year market norm."},
            {"section": "Section 4: Remedies & Injunctive Relief", "risk": "HIGH", "score": 85, "reason": "Unilateral indemnification and injunction without bond requirement creates high financial exposure for Receiving Party."},
            {"section": "Section 5: Governing Law", "risk": "LOW", "score": 25, "reason": "Standard California jurisdiction for tech agreements."}
        ],
        "clauses": [
            {"type": "Confidentiality", "section": "Section 1 & 2", "text": "Receiving Party shall hold all Confidential Information in strict confidence and use reasonable care.", "risk": "LOW"},
            {"type": "Termination", "section": "Section 3", "text": "Agreement remains in effect for 3 years; confidentiality obligations survive for 5 years post-termination.", "risk": "MEDIUM"},
            {"type": "Indemnity", "section": "Section 4", "text": "Receiving Party agrees to indemnify and hold harmless Disclosing Party against losses; injunctive relief without bond.", "risk": "HIGH"},
            {"type": "Liability", "section": "Section 4", "text": "Full indemnification for damages with no financial cap specified.", "risk": "HIGH"}
        ]
    },

    "demo_employment": {
        "doc_id": "demo_employment",
        "name": "Senior_Engineer_Employment_Agreement.pdf",
        "type": "Employment",
        "description": "Full-time software engineer contract containing non-compete, IP assignment, and termination clauses.",
        "text": """EXECUTIVE & SOFTWARE ENGINEER EMPLOYMENT AGREEMENT

This Agreement is made between CloudCore Systems Inc. ("Company") and Jane Doe ("Employee").

1. DUTIES AND AT-WILL EMPLOYMENT
Employee is hired as Senior Principal Engineer. Employment is strictly at-will, meaning either Employee or Company may terminate the employment relationship at any time, with or without cause or advance notice.

2. INTELLECTUAL PROPERTY ASSIGNMENT
Employee agrees that all inventions, patentable subject matter, code, designs, and work product conceived, created, or developed during employment, whether on company premises or using company equipment, belong exclusively to the Company ("Work for Hire").

3. NON-COMPETE AND NON-SOLICITATION
During employment and for a period of twenty-four (24) months following termination, Employee shall not directly or indirectly work for, consult with, or invest in any business competing with Company within North America or Europe. Employee shall not solicit any client, vendor, or employee of Company.

4. LIMITATION OF LIABILITY & RECOUPMENT
Company reserves the right to claw back any performance bonuses or unvested equity grants if Employee leaves prior to 12 months or engages in competitive activity.

5. ARBITRATION & WAIVER OF CLASS ACTION
Any controversy or claim arising out of or relating to this agreement shall be settled by binding arbitration in Delaware. Employee explicitly waives any right to join or participate in a class action lawsuit against Company.
""",
        "risk_heatmap": [
            {"section": "Section 1: At-Will Employment", "risk": "MEDIUM", "score": 45, "reason": "Standard at-will clause, but allows immediate termination without severance."},
            {"section": "Section 2: IP Assignment", "risk": "LOW", "score": 30, "reason": "Standard Work-for-Hire clause for software engineering roles."},
            {"section": "Section 3: Non-Compete & Non-Solicitation", "risk": "HIGH", "score": 95, "reason": "24-month post-employment non-compete covering entire NA & Europe is overly broad and unenforceable in many states (e.g. CA, NY)."},
            {"section": "Section 4: Bonus Clawback", "risk": "HIGH", "score": 80, "reason": "Unilateral bonus and equity clawback if employee departs before 12 months."},
            {"section": "Section 5: Binding Arbitration", "risk": "MEDIUM", "score": 60, "reason": "Mandatory arbitration waives court trial rights and class action participation."}
        ],
        "clauses": [
            {"type": "Termination", "section": "Section 1", "text": "Employment is strictly at-will; either party may terminate without cause or advance notice.", "risk": "MEDIUM"},
            {"type": "Non-Compete", "section": "Section 3", "text": "24 months post-employment restriction across North America and Europe.", "risk": "HIGH"},
            {"type": "Confidentiality & IP", "section": "Section 2", "text": "Exclusive company ownership of all work product conceived during employment.", "risk": "LOW"},
            {"type": "Payment & Clawback", "section": "Section 4", "text": "Company retains right to claw back bonuses and equity upon early departure.", "risk": "HIGH"}
        ]
    },

    "demo_saas": {
        "doc_id": "demo_saas",
        "name": "Enterprise_SaaS_Master_Services_Agreement.pdf",
        "type": "SaaS MSA",
        "description": "B2B SaaS service agreement with SLA uptime, liability caps, and auto-renewal terms.",
        "text": """ENTERPRISE SAAS MASTER SERVICES AGREEMENT

This Master Services Agreement ("MSA") is entered into by SaaSCloud LLC ("Provider") and Enterprise Customer ("Customer").

1. SERVICE LEVEL AGREEMENT (SLA) & UPTIME
Provider target uptime is 99.5% per calendar month, excluding scheduled maintenance. Service credits are limited to a 5% billing credit for outages exceeding 12 consecutive hours.

2. PAYMENT & UNILATERAL PRICE ADJUSTMENTS
Subscription fees are billed annually in advance. Provider reserves the right to increase subscription rates by up to 15% upon each annual renewal notice without requiring Customer approval.

3. LIMITATION OF LIABILITY
In no event shall Provider's total aggregate liability under this agreement exceed the total amount paid by Customer in the one (1) month preceding the event giving rise to liability. Provider excludes all indirect, consequential, or punitive damages.

4. AUTOMATIC RENEWAL & CANCELLATION NOTICE
This agreement shall automatically renew for successive twelve (12) month terms unless Customer provides written notice of cancellation at least ninety (90) days prior to the expiration of the current term.

5. DATA PRIVACY AND SECURITY
Provider maintains SOC 2 Type II certification. In the event of a security breach, Provider will notify Customer within seventy-two (72) hours of confirmed security incident.
""",
        "risk_heatmap": [
            {"section": "Section 1: SLA & Service Credits", "risk": "MEDIUM", "score": 50, "reason": "99.5% uptime target is slightly below enterprise 99.9% standard; 5% credit limit is weak."},
            {"section": "Section 2: Unilateral Rate Hike", "risk": "HIGH", "score": 85, "reason": "Allows Provider to raise rates by 15% annually without Customer consent."},
            {"section": "Section 3: Liability Cap", "risk": "HIGH", "score": 90, "reason": "Liability capped at just 1 month of fees is severely asymmetrical and risky for Customer."},
            {"section": "Section 4: Auto-Renewal", "risk": "MEDIUM", "score": 65, "reason": "90-day advance cancellation window is unusually strict; failure to notify locks customer in for 12 months."},
            {"section": "Section 5: Data Breach Notification", "risk": "LOW", "score": 25, "reason": "72-hour notice complies with standard GDPR/CCPA notification timelines."}
        ],
        "clauses": [
            {"type": "Payment", "section": "Section 2", "text": "Annual advance billing; Provider may increase fees up to 15% upon renewal unilaterally.", "risk": "HIGH"},
            {"type": "Liability", "section": "Section 3", "text": "Provider liability capped at 1 month of fees preceding incident; consequential damages excluded.", "risk": "HIGH"},
            {"type": "Termination", "section": "Section 4", "text": "Automatic 12-month renewal unless cancelled 90 days prior to term end.", "risk": "MEDIUM"},
            {"type": "Confidentiality & Data", "section": "Section 5", "text": "SOC 2 Type II compliance with 72-hour incident notification timeline.", "risk": "LOW"}
        ]
    }
}
