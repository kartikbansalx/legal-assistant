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
"""
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
"""
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
"""
    }
}
